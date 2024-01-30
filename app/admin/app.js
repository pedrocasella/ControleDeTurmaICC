import { getDatabase, ref, set, push, child, get, remove, update } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP8hj7lSAwmQmxgfJRzTrdtYYJtckXbpQ",
  authDomain: "carteirinhas-icone.firebaseapp.com",
  projectId: "carteirinhas-icone",
  storageBucket: "carteirinhas-icone.appspot.com",
  messagingSenderId: "56784942993",
  appId: "1:56784942993:web:bee8ad1b22e6e20eb28c30"
};


const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const database = getDatabase(app);

const dbRef = ref(getDatabase());


// Obter o email armazenado no localStorage
const storedEmail = localStorage.getItem('user_classroom_app_email');

if (storedEmail) {
    // Verificar a permissão do usuário no banco de dados
    const authorizedUsersRef = ref(database, 'icone_id/equipe');
    get(authorizedUsersRef)
        .then((snapshot) => {
            let userPermission = null;

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email === storedEmail && userData.appsAutorizados.includes('controledeturma.app')) {
                    userPermission = userData.permissao;
                }
            });

            if (userPermission !== 'admin') {
                // Exibir aviso de acesso negado
                window.location.assign('./../../app/')
            } else {
                document.getElementById('body').style.display = 'block'
            }
        })
        .catch(error => {
            console.error("Erro ao buscar usuários autorizados:", error);
        });
} else {
    window.location.assign('./../../app/')
}



//Tabela de Usuário


// Função para gerar a tabela de usuários
function generateUsersTable() {
    const usuariosArea = document.getElementById('usuarios-area');
    const authorizedUsersRef = ref(database, 'icone_id/equipe');
    const inspetoresRef = ref(database, 'controledeturma/inspetores/');
    
    get(authorizedUsersRef).then((snapshot) => {
        usuariosArea.innerHTML = ''; // Limpa o conteúdo anterior
    
        const equipeData = snapshot.val();
    
        if (equipeData) {
            // Itera sobre cada usuário na equipe
            Object.values(equipeData).forEach((data) => {
                // Verifica se o usuário tem a aplicação autorizada
                if (data.appsAutorizados && data.appsAutorizados.includes('controledeturma.app')) {
                    // Cria um elemento ul para o usuário
                    const ulElement = document.createElement('ul');
                    ulElement.innerHTML = `
                        <li><p class="nome-usuario">${data.nome}</p></li><hr>
                        <li><p class="email-usuario">${data.email}</p></li><hr>
                        <li><p class="disciplina-usuario">${data.funcao[0]}</p></li>
                        <li>
                            <label class="switch">
                                <input type="checkbox" class="user-visibilidade" data-user-email="${data.email}" data-user-name="${data.nome}">
                                <span class="slider round"></span>
                            </label>
                        </li>
                    `;
    
                    // Adiciona o elemento ul ao #usuarios-area
                    usuariosArea.appendChild(ulElement);
    
                    // Verifica se o nome está presente em 'inspetores'
                    const inspetorSwitch = ulElement.querySelector('.user-visibilidade');
                    const inspetorName = data.nome;
                    const inspetorRef = ref(database, 'controledeturma/inspetores/' + inspetorName);
    
                    get(inspetorRef).then((inspetorSnapshot) => {
                        const isChecked = inspetorSnapshot.exists();
                        inspetorSwitch.checked = isChecked;
                    });
    
                    // Adiciona um ouvinte de evento de mudança ao switch
                    inspetorSwitch.addEventListener('change', (event) => {
                        const targetSwitch = event.target;
                        const email = targetSwitch.dataset.userEmail;
                        const isChecked = targetSwitch.checked;
    
                        if (isChecked) {
                            // Adiciona o email em 'controledeturma/inspetores/'
                            set(inspetorRef, {
                                email
                            });
                        } else {
                            // Remove o email em 'controledeturma/inspetores/'
                            remove(inspetorRef);
                        }
                    });
                }
            });
        } else {
            console.log('Nenhum dado de equipe encontrado.');
        }
    }).catch((error) => {
        console.error('Erro ao obter dados:', error);
    });
    


}

// Chamar a função para gerar a tabela inicialmente
generateUsersTable();



  






