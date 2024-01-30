import { getDatabase, ref, set, push, child, get, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

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

document.getElementById('login-voucher').addEventListener('click', ()=>{
    document.getElementById('voucher-acess').style.display = 'block'
})

document.getElementById('return-voucher').addEventListener('click', ()=>{
    document.getElementById('voucher-acess').style.display = 'none'
})

document.getElementById('voucher-btn').addEventListener('click', ()=>{
    const voucher = document.getElementById('input-voucher').value.trim();

    // Verificar se o voucher existe em authorized_users
    const authorizedUsersRef = ref(database, 'icone_id/equipe');

    get(authorizedUsersRef)
        .then((snapshot) => {
            let userFound = false;
            let userData;

            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if (user.voucher === voucher) {
                    userFound = true;
                    userData = user;
                }
            });

            if (userFound) {
                localStorage.setItem('user_classroom_app_name', userData.nome);
                localStorage.setItem('user_classroom_app_function', userData.funcao);
                localStorage.setItem('user_classroom_app_email', userData.email);
                window.location.assign('./../app/');
            } else {
                alert('Voucher não encontrado')
            }
        })
        .catch(error => {
            console.error("Erro ao verificar voucher:", error);
        });
})

document.getElementById('login-btn').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user);

            const emailToCheck = user.email;

            // Verificar se o email já existe em authorized_users
            const authorizedUsersRef = ref(database, 'icone_id/equipe');

            get(authorizedUsersRef)
                .then((snapshot) => {
                    let userFound = false;
                    let userFunction = "";

                    snapshot.forEach((childSnapshot) => {
                        const userData = childSnapshot.val();
                        if (userData.email === emailToCheck) {
                            userFound = true;
                            userFunction = userData.funcao[0]; // Supondo que a função seja um array
                            localStorage.setItem('user_classroom_app_name', user.displayName);
                            localStorage.setItem('user_classroom_app_function', userFunction);
                            localStorage.setItem('user_classroom_app_email', user.email);
                            window.location.assign('./../app/')
                        }
                    });

                    if (!userFound) {
                        // Caso o email não exista, adicionamos o usuário em solicited_acess
                        const newUserRef = ref(database, 'icone_id/solicited_acess/');

                        const pushNewUser = push(newUserRef)
                        set(pushNewUser, {
                            nome: user.displayName,
                            email: user.email,
                            funcao: [''],
                            appsAutorizados: ['controledeturma.app'],
                            permissao: '',
                            uuid: pushNewUser.key
                        })
                            .then(() => {
                                document.getElementById('deny-acess').style.display = 'block'

                                setTimeout(()=>{
                                    document.getElementById('deny-acess').style.display = 'none'
                                }, 1000*4)
                            })
                            .catch(error => {
                                console.error("Erro ao adicionar usuário em solicited_acess:", error);
                            });
                    } else {
                        // O email já existe em authorized_users
                        console.log("Usuário já existe em authorized_users.");
                        document.getElementById('allow-acess').style.display = 'block'

                        setTimeout(()=>{
                            document.getElementById('allow-acess').style.display = 'none'
                            window.location.assign('./../app/')
                        }, 1000*2)
                        
                    }
                })
                .catch(error => {
                    console.error("Erro ao verificar email:", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
});



