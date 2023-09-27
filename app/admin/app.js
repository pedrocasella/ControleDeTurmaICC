import { getDatabase, ref, set, push, child, get, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
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

document.getElementById('select-permissao').addEventListener('change', ()=>{

    if(document.getElementById('select-permissao').value == 'admin'){
        document.getElementById('warning').style.display = 'block'
    }else{
        document.getElementById('warning').style.display = 'none'
    }
})

// Obter o email armazenado no localStorage
const storedEmail = localStorage.getItem('user_classroom_app_email');

if (storedEmail) {
    // Verificar a permissão do usuário no banco de dados
    const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');
    get(authorizedUsersRef)
        .then((snapshot) => {
            let userPermission = null;

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email === storedEmail) {
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


//Cadastrar novo Acesso
document.getElementById("add-acess-btn").addEventListener("click", () => {
    const nome = document.getElementById("add-acess-nome").value;
    const email = document.getElementById("add-acess-email").value;
    const funcao = document.getElementById("add-acess-funcao").value;
    const permissao = document.getElementById("select-permissao").value;

    if(nome == '' || email == '' || funcao == ''){
        alert('Por favor, preencha todos os campos!')
    }else{
        // Gerar uma chave aleatória usando o método push()
        function generateRandomVoucher() {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let voucher = "";
            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                voucher += characters.charAt(randomIndex);
            }
            return voucher;
        }
        const newUserRef = push(ref(database, 'acess_app_classroom_controller/authorized_users'));

        // Montar o objeto com os dados do novo usuário
        const newUser = {
            nome: nome,
            email: email,
            funcao: [funcao],
            permissao: permissao,
            voucher: generateRandomVoucher()
        };

        // Adicionar os dados ao banco de dados usando a chave aleatória
        set(newUserRef, newUser)
            .then(() => {
                // Limpar os campos de entrada após a adição
                document.getElementById("add-acess-nome").value = "";
                document.getElementById("add-acess-email").value = "";
                document.getElementById("add-acess-funcao").value = "";
                document.getElementById("select-permissao").value = "none";
            })
            .catch(error => {
                console.error("Erro ao adicionar novo usuário:", error);
            });
    }

});


//Modal de Solicitação

// Função para lidar com o clique em Aceitar
function handleAccept(event) {
    const email = event.target.getAttribute('data-email');
    const solictedAccessRef = ref(database, 'acess_app_classroom_controller/solicited_acess');

    get(solictedAccessRef)
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email === email) {
                    const acceptModal = document.getElementById('accept-confirm');
                    const acceptName = document.getElementById('accept-name');
                    const acceptEmail = document.getElementById('accept-email');

                    acceptName.innerHTML = `<strong>Nome: </strong>${userData.nome}`;
                    acceptEmail.innerHTML = `<strong>Email: </strong>${userData.email}`;

                    // Abrir o modal de confirmação
                    acceptModal.style.display = 'block';

                    // Adicionar evento de clique ao botão de confirmação
                    const confirmAcceptBtn = document.getElementById('confirm-accept-btn');
                    confirmAcceptBtn.addEventListener('click', () => {
                        const acceptFuncao = document.getElementById('accept-funcao').value;
                        const acceptPermissao = document.getElementById('accept-permissao').value;

                        if(acceptFuncao == ''){
                            alert('Todos os campos devem ser preenchidos')
                        }else{
                             // Gerar uma chave aleatória para authorized_users
                            function generateRandomVoucher() {
                                const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                                let voucher = "";
                                for (let i = 0; i < 6; i++) {
                                    const randomIndex = Math.floor(Math.random() * characters.length);
                                    voucher += characters.charAt(randomIndex);
                                }
                                return voucher;
                            }
                            const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');
                            const newUserRef = push(authorizedUsersRef);

                            const newUser = {
                                nome: userData.nome,
                                email: userData.email,
                                funcao: [acceptFuncao], // Supondo que a função seja um array
                                permissao: acceptPermissao,
                                voucher: generateRandomVoucher()
                            };

                            set(newUserRef, newUser)
                                .then(() => {
                                    // Remover o nó correspondente a essa solicitação de acesso
                                    remove(childSnapshot.ref)
                                        .then(() => {
                                            window.location.reload()
                                        })
                                        .catch(error => {
                                            console.error("Erro ao remover solicitação de acesso:", error);
                                        });
                                })
                                .catch(error => {
                                    console.error("Erro ao adicionar usuário em authorized_users:", error);
                                });
                        }


                    });
                }
            });
        })
        .catch(error => {
            console.error("Erro ao buscar solicitações de acesso:", error);
        });
}


// Função para lidar com o clique em Recusar
function handleDeny(event) {
    const email = event.target.getAttribute('data-email');
    const solicitedAccessRef = ref(database, `acess_app_classroom_controller/solicited_acess`);

    // Remover o nó correspondente ao email recusado
    get(solicitedAccessRef)
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email === email) {
                    remove(childSnapshot.ref)
                        .then(() => {
                            generateSolicitedAccessList(); // Atualizar a lista após a remoção
    
                        })
                        .catch(error => {
                            console.error("Erro ao recusar solicitação de acesso:", error);
                        });
                }
            });
        })
        .catch(error => {
            console.error("Erro ao buscar solicitações de acesso:", error);
        });
}

// Chamar a função para gerar a lista inicialmente
generateSolicitedAccessList();

// Função para gerar a lista de solicitações de acesso
function generateSolicitedAccessList() {
    const solictedAccessRef = ref(database, 'acess_app_classroom_controller/solicited_acess');

    get(solictedAccessRef)
        .then((snapshot) => {
            const ulElement = document.getElementById('solicited-acess-ul');
            ulElement.innerHTML = ""; // Limpar a lista antes de gerar novamente

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();

                const liElement = document.createElement('li');
                liElement.innerHTML = `
                    <span>Nome:</span> ${userData.nome} <br>
                    <span>Email:</span> ${userData.email} <br>
                    <ul class="btn-ul" id="btn-ul">
                        <li><div class="btn accept-btn" data-email="${userData.email}">Aceitar</div></li>
                        <li><div class="btn deny-btn" data-email="${userData.email}">Recusar</div></li>
                    </ul>
                `;

                ulElement.appendChild(liElement);
            });

            // Adicionar event listeners aos botões de aceitar e recusar
            const acceptButtons = document.querySelectorAll('.accept-btn');
            const denyButtons = document.querySelectorAll('.deny-btn');

            acceptButtons.forEach(button => {
                button.addEventListener('click', handleAccept);
            });

            denyButtons.forEach(button => {
                button.addEventListener('click', handleDeny);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar solicitações de acesso:", error);
        });
}

//abre o modal de solicitações

document.getElementById('solicitations-btn').addEventListener('click', ()=>{
    if(document.getElementById('solicited-acess-ul').innerHTML == ''){
        alert('Não existe nenhuma solicitação disponível no momento.')
    }else{
        document.getElementById('black-background').style.display = 'block'
        document.getElementById('solicited-acess-modal').style.display = 'block'
    }

})

//fecha o confirmar
document.getElementById('exit-accept-confirm').addEventListener('click', ()=>{
   window.location.reload()
})

//fecha o modal de solicitações

document.getElementById('exit-solicited-acess-modal').addEventListener('click', ()=>{
    document.getElementById('black-background').style.display = 'none'
    document.getElementById('solicited-acess-modal').style.display = 'none'
})

//Tabela de Usuário

// Função para gerar a tabela de usuários
function generateUsersTable() {
    const usersTable = document.getElementById('table-users');
    const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');

    get(authorizedUsersRef)
        .then((snapshot) => {
            const tbody = usersTable.querySelector('tbody');
            tbody.innerHTML = ''; // Limpar a tabela antes de gerar novamente

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                const userPermission = userData.permissao; // Capturar a permissão do usuário

                const trElement = document.createElement('tr');
                trElement.innerHTML = `
                <td class="td-username">${userData.nome}</td>
                <td class="td-usermail">${userData.email}</td>
                <td>
                ${userData.funcao[0]} 
                <span class="add-disciplina" data-email="${userData.email}" id="add-disciplina">+</span>
                </td>
                <td>
                    <select name="autorizacao[]">
                        <option value="none">Acesso ao App</option>
                        <option value="admin" ${userPermission === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </td>
                <td><div class="confirm-change-btn" data-email="${userData.email}" id="confirm-change-btn"></div></td>
                <td><div class="remove-btn" data-email="${userData.email}" id="remove-btn"></div></td>
            `;
            

                tbody.appendChild(trElement);
            });

            function editUser(){
                const addDisciplinaBtns = document.querySelectorAll('.add-disciplina');
                addDisciplinaBtns.forEach(button => {
                    button.addEventListener('click', () => {
                        const email = button.getAttribute('data-email');
                        const editUserDiv = document.getElementById('edit-user');
                        const editNameInput = document.getElementById('edit-name');
                        const addFuncaoInput = document.getElementById('add-funcao');
                        const funcaoList = document.querySelector('.edit-user ul');
                        const funcaoBtn = document.getElementById('add-funcao-btn')
                        
                        // Obter dados do usuário correspondente
                        const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');
                        get(authorizedUsersRef)
                            .then((snapshot) => {
                                snapshot.forEach((childSnapshot) => {
                                    const userData = childSnapshot.val();
                                    if (userData.email === email) {
                                        editNameInput.value = userData.nome;
                                        // Limpar a lista de funções
                                        funcaoList.innerHTML = '';
                                        funcaoBtn.setAttribute('data-email', email)
                                        // Preencher a lista de funções
                                        userData.funcao.forEach(funcao => {
                                            const liElement = document.createElement('li');
                                            liElement.innerHTML = `
                                                <div class="funcao-div">${funcao} <div class="remove-funcao">-</div></div>
                                            `;
                                            funcaoList.appendChild(liElement);

                                            function removeFunction(){
                                                // Adicionar evento de clique ao botão de remover função
                                                const removeFuncaoBtn = liElement.querySelector('.remove-funcao');
                                                removeFuncaoBtn.addEventListener('click', () => {
                                                    if (userData.funcao.length > 1) {
                                                        const funcaoToRemove = funcao; // Função a ser removida
                                                        const updatedFuncoes = userData.funcao.filter(f => f !== funcaoToRemove); // Filtrar para remover a função
                                                        
                                                        // Atualizar o array de funções do usuário no banco de dados
                                                        const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');
                                                        get(authorizedUsersRef)
                                                            .then((snapshot) => {
                                                                snapshot.forEach((childSnapshot) => {
                                                                    const childData = childSnapshot.val();
                                                                    if (childData.email === email) {
                                                                        const updatedUserData = { ...childData, funcao: updatedFuncoes };
                                                                        set(childSnapshot.ref, updatedUserData)
                                                                            .then(() => {
                                                                            
                                                                                window.location.reload()
                                                                            })
                                                                            .catch(error => {
                                                                                console.error("Erro ao remover função:", error);
                                                                            });
                                                                    }
                                                                });
                                                            })
                                                            .catch(error => {
                                                                console.error("Erro ao buscar usuários autorizados:", error);
                                                            });
                                                    } else {
                                                        alert("O usuário deve ter pelo menos uma função.");
                                                    }

                                                  })
                                                                                                
                                            }
                                            removeFunction()
                                            
                                        });
                                        // Abrir a div de edição do usuário
                                        document.getElementById('black-background').style.display = 'block'
                                        editUserDiv.style.display = 'block';
                                    }
                                });
                            })
                            .catch(error => {
                                console.error("Erro ao buscar usuários autorizados:", error);
                            });
                    });
                });

                const addFuncaoBtn = document.querySelector('.add-funcao-btn');
                addFuncaoBtn.addEventListener('click', () => {
                    const addFuncaoInput = document.getElementById('add-funcao');
                    const email = addFuncaoBtn.getAttribute('data-email'); // Obtém o email do usuário correspondente
                    const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');

                    // Obter os dados do usuário correspondente
                    get(authorizedUsersRef)
                        .then((snapshot) => {
                            snapshot.forEach((childSnapshot) => {
                                const userData = childSnapshot.val();
                                if (userData.email === email) {
                                    const funcoes = userData.funcao.slice(); // Cria uma cópia do array de funções
                                    const newFuncao = addFuncaoInput.value.trim();
                                    if (newFuncao !== '') {
                                        funcoes.push(newFuncao);
                                        const updatedUserData = { ...userData, funcao: funcoes };

                                        // Atualizar os dados do usuário no banco de dados
                                        set(childSnapshot.ref, updatedUserData)
                                            .then(() => {
                                                window.location.reload()
                                                addFuncaoInput.value = ''; // Limpar o campo de adicionar função
                                            })
                                            .catch(error => {
                                                console.error("Erro ao adicionar função:", error);
                                            });
                                    }
                                }
                            });
                        })
                        .catch(error => {
                            console.error("Erro ao buscar usuários autorizados:", error);
                        });
                });

                const saveChangesBtn = document.querySelector('.save-changes');
                saveChangesBtn.addEventListener('click', () => {
                    const editNameInput = document.getElementById('edit-name').value;
                    const funcaoDivs = document.querySelectorAll('.funcao-div');
                    const funcoes = Array.from(funcaoDivs).map(div => div.textContent.trim());
                    
                    const email = document.querySelector('.add-funcao-btn').getAttribute('data-email');
                    const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');

                    // Atualizar os dados do usuário no banco de dados
                    get(authorizedUsersRef)
                        .then((snapshot) => {
                            snapshot.forEach((childSnapshot) => {
                                const userData = childSnapshot.val();
                                if (userData.email === email) {
                                    const updatedUserData = { ...userData, nome: editNameInput};
                                    set(childSnapshot.ref, updatedUserData)
                                        .then(() => {
                                            window.location.reload()
                                        })
                                        .catch(error => {
                                            console.error("Erro ao atualizar dados:", error);
                                        });
                                }
                            });
                        })
                        .catch(error => {
                            console.error("Erro ao buscar usuários autorizados:", error);
                        });
                });
            }

            function removeUser(){
                // Evento para atualizar a tabela após remover um usuário
                const removeBtns = document.querySelectorAll('.remove-btn');
                removeBtns.forEach(button => {
                    button.addEventListener('click', () => {
                        const email = button.getAttribute('data-email');
                        const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');
            
                        // Remover o nó correspondente ao email
                        get(authorizedUsersRef)
                            .then((snapshot) => {
                                snapshot.forEach((childSnapshot) => {
                                    const userData = childSnapshot.val();
                                    if (userData.email === email) {
                                        remove(childSnapshot.ref)
                                            .then(() => {
                                                generateUsersTable(); // Atualizar a tabela após a remoção
                                            })
                                            .catch(error => {
                                                console.error("Erro ao remover usuário:", error);
                                            });
                                    }
                                });
                            })
                            .catch(error => {
                                console.error("Erro ao buscar usuários autorizados:", error);
                            });
                    });
                });
            }

            function actualizePermission(){
                // Evento para atualizar a tabela após confirmar a adição de um usuário
                const confirmChangeBtns = document.querySelectorAll('.confirm-change-btn');
                confirmChangeBtns.forEach(button => {
                    button.addEventListener('click', () => {
                        const email = button.getAttribute('data-email');
                        const selectElement = button.parentNode.parentNode.querySelector('select[name="autorizacao[]"]');
                        const newPermission = selectElement.value;

                        const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');

                        get(authorizedUsersRef)
                            .then((snapshot) => {
                                snapshot.forEach((childSnapshot) => {
                                    const userData = childSnapshot.val();
                                    if (userData.email === email) {
                                        const updatedUserData = { ...userData, permissao: newPermission };
                                        set(childSnapshot.ref, updatedUserData)
                                            .then(() => {
                                                generateUsersTable(); // Atualizar a tabela após a atualização
                                            })
                                            .catch(error => {
                                                console.error("Erro ao atualizar permissão:", error);
                                            });
                                    }
                                });
                            })
                            .catch(error => {
                                console.error("Erro ao buscar usuários autorizados:", error);
                            });
                    });
                });
            }

            function search(){
                //Função de Procura na tabela
                document.getElementById('search').addEventListener('input', function () {
                    const searchText = this.value.trim().toLowerCase();
                    const rows = document.querySelectorAll('#table-users tbody tr');

                    rows.forEach(row => {
                        const nameCell = row.querySelector('.td-username');
                        const emailCell = row.querySelector('.td-usermail');

                        if (nameCell && emailCell) {
                            const name = nameCell.textContent.toLowerCase();
                            const email = emailCell.textContent.toLowerCase();

                            if (name.includes(searchText) || email.includes(searchText)) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        }
                    });
                });
            }

            search()
            editUser()
            actualizePermission()
            removeUser()
        })
        .catch(error => {
            console.error("Erro ao buscar usuários autorizados:", error);
        });

}

// Chamar a função para gerar a tabela inicialmente
generateUsersTable();

document.getElementById('black-background').addEventListener('click', (e)=>{
    if(e.target.id == 'black-background'){
        document.getElementById('edit-user').style.display = 'none'
        document.getElementById('black-background').style.display = 'none'
        document.getElementById('solicited-acess-modal').style.display = 'none'
    }
})



/*
// Obtendo as chaves (nomes) dos objetos de e-mail
const emailKeys = Object.keys(JSON1.emails);

// Iterando sobre as chaves (nomes) usando forEach
emailKeys.forEach(emailKey => {
    const emailObj = JSON1.emails[emailKey];
    const email = emailObj.email;
    const matéria = emailObj.matéria;

    //console.log(`Chave: ${emailKey}, Email: ${email}, Matéria: ${matéria}`);
    console.log('"' + emailKey + '": { "email": ' + email + ', "funcao": [ ' + matéria + ' ], "nome": "", "permissao": "none" },')
    document.getElementById('test').innerHTML += '"' + emailKey + '": { "email": "' + email + '", "funcao": [ "' + matéria + '" ], "nome": "", "permissao": "none" },'
});*/







