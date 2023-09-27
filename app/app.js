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

// Obter o email armazenado no localStorage
const storedEmail = localStorage.getItem('user_classroom_app_email');

if (storedEmail) {
    // Verificar se o email existe no banco de dados
    const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');
    get(authorizedUsersRef)
        .then((snapshot) => {
            let emailExists = false;

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email === storedEmail) {
                    emailExists = true;
                }
            });

            if (!emailExists) {
                // Exibir aviso de que o email não existe no banco de dados
                window.location.assign('./../login');
            } else {
                // O email existe no banco de dados, você pode prosseguir com a lógica do aplicativo
                // ...
                document.getElementById('body').style.display = 'block'
            }
        })
        .catch(error => {
            console.error("Erro ao buscar usuários autorizados:", error);
        });
} else {
    // O email não está armazenado no localStorage, você pode lidar com isso de acordo com sua lógica
    window.location.assign('./../login')
    
}

//Verificar Funções
if (storedEmail) {
    // Consultar o banco de dados para obter as funções associadas ao email
    const authorizedUsersRef = ref(database, 'acess_app_classroom_controller/authorized_users');
    get(authorizedUsersRef)
        .then((snapshot) => {
            let userFunctions = [];

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email === storedEmail) {
                    userFunctions = userData.funcao || []; // Pode haver casos em que a chave 'funcao' não exista
                }
            });

            if (userFunctions.length > 0) {
                // Armazenar as funções no localStorage como um array
                localStorage.setItem('user_classroom_app_functions', JSON.stringify(userFunctions));
                //Seleciona a Matéria que está sendo lecionada
            // Obter o valor armazenado no localStorage
            const storedFunctions = localStorage.getItem('user_classroom_app_functions');

            if (storedFunctions) {
                try {
                    // Transformar o valor em um objeto JSON
                    const userFunctionsObj = JSON.parse(storedFunctions);

                    // Agora você tem um objeto JSON userFunctionsObj

                    if(userFunctionsObj.length <= 1){
                        document.getElementById('function-select').style.display = 'none'
                        Object.keys(userFunctionsObj).forEach(key => {
                            const functionName = key;
                            const functionRole = userFunctionsObj[key];
                            document.getElementById('function-select').innerHTML += '<option value="' + functionRole + '">' + functionRole + '</option>'
                        });
                    }else{
                        Object.keys(userFunctionsObj).forEach(key => {
                            const functionName = key;
                            const functionRole = userFunctionsObj[key];
                            document.getElementById('function-select').innerHTML += '<option value="' + functionRole + '">' + functionRole + '</option>'
                        });
                    }

                
                    
                } catch (error) {
                    console.error("Erro ao converter o valor para JSON:", error);
                 }

} else {
    // O valor não está armazenado no localStorage ou é inválido
    // ...
}
            } else {
                // Não há funções para esse usuário, você pode lidar com isso de acordo com sua lógica
            }
        })
        .catch(error => {
            console.error("Erro ao buscar usuários autorizados:", error);
        });
} else {
    // O email não está armazenado no localStorage, você pode lidar com isso de acordo com sua lógica
    // ...
}

get(child(dbRef, 'Sponte_API/')).then((snapshot) => {
    if (snapshot.exists()) {


        const data = snapshot.val()
        
        const codClienteUnidadeI = data.unidade_i.codigo_cliente
        const tokenUnidadeI = data.unidade_i.token

        const codClienteUnidadeII = data.unidade_ii.codigo_cliente
        const tokenUnidadeII = data.unidade_ii.token

        const codClienteUnidadeIII = data.unidade_iii.codigo_cliente
        const tokenUnidadeIII = data.unidade_iii.token

        const codClienteUnidadeIV = data.unidade_iv.codigo_cliente
        const tokenUnidadeIV = data.unidade_iv.token

        function unidadeI(){
            // Cria um novo objeto XMLHttpRequest
            var xhr = new XMLHttpRequest();
    
            // Configura a função de callback para quando a requisição estiver pronta
            xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // A resposta da requisição estará em xhr.responseXML
                var xmlResponse = xhr.responseXML;
    
                const turmas = xmlResponse.getElementsByTagName('wsTurma')
    
                const select = document.getElementById('select-turma')
    
                for(let i = 0; i <= turmas.length; i++){
                    if(turmas[i].childNodes[9].innerHTML == 'Aberta'){
                        select.innerHTML += '<option value="' + turmas[i].childNodes[3].innerHTML + '">' + turmas[i].childNodes[3].innerHTML.replace('- 2023', '') + '</option>'
                    }
                    
                }
            }
            };
    
            // Abre uma requisição GET para a URL da API que retorna XML
            xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetTurmas?nCodigoCliente=" + codClienteUnidadeI + "&sToken=" + tokenUnidadeI + "&sParametrosBusca=AnoLetivo=2023", true);
    
            // Envia a requisição
            xhr.send();
    
    
            //
            document.getElementById('select-turma').addEventListener('change', ()=>{
                document.getElementById('alunos-lista').innerHTML = ''
                // Cria um novo objeto XMLHttpRequest
                var xhr = new XMLHttpRequest();
    
                // Configura a função de callback para quando a requisição estiver pronta
                xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // A resposta da requisição estará em xhr.responseXML
                    var xmlResponse = xhr.responseXML;
        
                    const alunos = xmlResponse.getElementsByTagName('wsAluno')
                
    
                    for(let i = 0; i <= alunos.length; i++){
                        if(alunos[i].childNodes[37].innerHTML == document.getElementById('select-turma').value){
                            function picture(){
                                // Cria um novo objeto XMLHttpRequest
                                var xhr = new XMLHttpRequest();
    
                                // Configura a função de callback para quando a requisição estiver pronta
                                xhr.onreadystatechange = function() {
                                if (xhr.readyState === 4 && xhr.status === 200) {
                                    // A resposta da requisição estará em xhr.responseXML
                                    var xmlResponse = xhr.responseXML;
                                    const foto = xmlResponse.getElementsByTagName('wsFotoApp')
                                    document.getElementById(alunos[i].childNodes[3].innerHTML).style.backgroundImage = 'url(' + 'data:image/jpeg;base64,' + foto[0].childNodes[7].innerHTML + ')'
                                }
                                };
    
                                // Abre uma requisição GET para a URL da API que retorna XML
                                xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetImageApp?nCodigoCliente=" + codClienteUnidadeI + "&nAlunoID=" + alunos[i].childNodes[3].innerHTML + "&nResponsavelID=0&sToken=" + tokenUnidadeI, true);
    
                                // Envia a requisição
                                xhr.send();
    
                            
                            }
                            document.getElementById('alunos-lista').innerHTML += '<li> <ul class="data-aluno"> <li class="data-list"> <div class="picture" id="' + alunos[i].childNodes[3].innerHTML + '"></div></li> <li class="name" id="name">' + alunos[i].childNodes[5].innerHTML + '</li> </ul> </li>'
                            picture()
                            setTimeout(()=>{
                                const alunos = document.querySelectorAll('.data-aluno');
                                const foto = document.querySelectorAll('.alunos-lista .picture');
                                
                                alunos.forEach(aluno => {
                                    aluno.addEventListener('click', () => {
                                        const picture = aluno.querySelector('.picture').style.backgroundImage
                                        const nomeAluno = aluno.querySelector('.name').innerHTML
                                        const modal = document.getElementById('modal-opcoes');
                                        const nameProfile = document.getElementById('name-profile');
                                        const background = document.getElementById('black-background');
                                        const profilePicture = document.getElementById('photo')
                                        const footer = document.getElementById('footer')
                                        
                                        nameProfile.innerHTML = nomeAluno;
                                        profilePicture.style.backgroundImage = picture
                                        background.style.display = 'block'
                                        modal.style.display = 'block';
                                        footer.style.display = 'none'
                                        document.getElementById('select-unidade').style.display = 'none'
                                    });
                                });
                    
                                const modal = document.getElementById('modal-opcoes');
                                const background = document.getElementById('black-background');
                                const footer = document.getElementById('footer')
                                modal.addEventListener('click', (event) => {
                                    if (event.target === modal) {

                                    }
                                }, );
                            })
                        }
                    }
                }
                };
                
                // Abre uma requisição GET para a URL da API que retorna XML
                xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetAlunos2?nCodigoCliente=" + codClienteUnidadeI + "&sToken=" + tokenUnidadeI + "&sParametrosBusca=Nome=", true);
        
                // Envia a requisição
                xhr.send();
    
    
    
            })
        }

        function unidadeII(){
            // Cria um novo objeto XMLHttpRequest
var xhr = new XMLHttpRequest();

// Configura a função de callback para quando a requisição estiver pronta
xhr.onreadystatechange = function() {
if (xhr.readyState === 4 && xhr.status === 200) {
 // A resposta da requisição estará em xhr.responseXML
 var xmlResponse = xhr.responseXML;

 const turmas = xmlResponse.getElementsByTagName('wsTurma')

 const select = document.getElementById('select-turma')

 for(let i = 0; i <= turmas.length; i++){
     if(turmas[i].childNodes[9].innerHTML == 'Aberta'){
         select.innerHTML += '<option value="' + turmas[i].childNodes[3].innerHTML + '">' + turmas[i].childNodes[3].innerHTML.replace('- 2023', '') + '</option>'
     }
     
 }
}
};

// Abre uma requisição GET para a URL da API que retorna XML
xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetTurmas?nCodigoCliente=" + codClienteUnidadeII + "&sToken=" + tokenUnidadeII + "&sParametrosBusca=AnoLetivo=2023", true);

// Envia a requisição
xhr.send();


//
document.getElementById('select-turma').addEventListener('change', ()=>{
 document.getElementById('alunos-lista').innerHTML = ''
 // Cria um novo objeto XMLHttpRequest
 var xhr = new XMLHttpRequest();

 // Configura a função de callback para quando a requisição estiver pronta
 xhr.onreadystatechange = function() {
 if (xhr.readyState === 4 && xhr.status === 200) {
     // A resposta da requisição estará em xhr.responseXML
     var xmlResponse = xhr.responseXML;

     const alunos = xmlResponse.getElementsByTagName('wsAluno')

     for(let i = 0; i <= alunos.length; i++){
         if(alunos[i].childNodes[37].innerHTML == document.getElementById('select-turma').value){
             function picture(){
                 // Cria um novo objeto XMLHttpRequest
                 var xhr = new XMLHttpRequest();

                 // Configura a função de callback para quando a requisição estiver pronta
                 xhr.onreadystatechange = function() {
                 if (xhr.readyState === 4 && xhr.status === 200) {
                     // A resposta da requisição estará em xhr.responseXML
                     var xmlResponse = xhr.responseXML;
                     const foto = xmlResponse.getElementsByTagName('wsFotoApp')
                     document.getElementById(alunos[i].childNodes[3].innerHTML).style.backgroundImage = 'url(' + 'data:image/jpeg;base64,' + foto[0].childNodes[7].innerHTML + ')'
                 }
                 };

                 // Abre uma requisição GET para a URL da API que retorna XML
                 xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetImageApp?nCodigoCliente=" + codClienteUnidadeII + "&nAlunoID=" + alunos[i].childNodes[3].innerHTML + "&nResponsavelID=0&sToken=" + tokenUnidadeII, true);

                 // Envia a requisição
                 xhr.send();

                
             }
             document.getElementById('alunos-lista').innerHTML += '<li> <ul class="data-aluno"> <li class="data-list"> <div class="picture" id="' + alunos[i].childNodes[3].innerHTML + '"></div></li> <li class="name" id="name">' + alunos[i].childNodes[5].innerHTML + '</li> </ul> </li>'
             picture()
             setTimeout(()=>{
                 const alunos = document.querySelectorAll('.data-aluno');
                 const foto = document.querySelectorAll('.alunos-lista .picture');
 
                 alunos.forEach(aluno => {
                     aluno.addEventListener('click', () => {
                         const picture = aluno.querySelector('.picture').style.backgroundImage
                         const nomeAluno = aluno.querySelector('.name').innerHTML
                         const modal = document.getElementById('modal-opcoes');
                         const nameProfile = document.getElementById('name-profile');
                         const background = document.getElementById('black-background');
                         const profilePicture = document.getElementById('photo')
                         const footer = document.getElementById('footer')
 
                         nameProfile.innerHTML = nomeAluno;
                         profilePicture.style.backgroundImage = picture
                         background.style.display = 'block'
                         modal.style.display = 'block';
                         footer.style.display = 'none'
                         document.getElementById('select-unidade').style.display = 'none'
                     });
                 });
     
                 const modal = document.getElementById('modal-opcoes');
                 const background = document.getElementById('black-background');
                 const footer = document.getElementById('footer')
                 modal.addEventListener('click', (event) => {
                     if (event.target === modal) {

                     }
                 }, );
             })
         }
     }
 }
 };
 
 // Abre uma requisição GET para a URL da API que retorna XML
 xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetAlunos2?nCodigoCliente=" + codClienteUnidadeII + "&sToken=" + tokenUnidadeII + "&sParametrosBusca=Nome=", true);

 // Envia a requisição
 xhr.send();



})
        }

        function unidadeIV(){
            // Cria um novo objeto XMLHttpRequest
            var xhr = new XMLHttpRequest();
    
            // Configura a função de callback para quando a requisição estiver pronta
            xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // A resposta da requisição estará em xhr.responseXML
                var xmlResponse = xhr.responseXML;
    
                const turmas = xmlResponse.getElementsByTagName('wsTurma')
    
                const select = document.getElementById('select-turma')
    
                for(let i = 0; i <= turmas.length; i++){
                    if(turmas[i].childNodes[9].innerHTML == 'Aberta'){
                        select.innerHTML += '<option value="' + turmas[i].childNodes[3].innerHTML + '">' + turmas[i].childNodes[3].innerHTML.replace('- 2023', '') + '</option>'
                    }
                    
                }
            }
            };
    
            // Abre uma requisição GET para a URL da API que retorna XML
            xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetTurmas?nCodigoCliente=" + codClienteUnidadeIV + "&sToken=" + tokenUnidadeIV + "&sParametrosBusca=AnoLetivo=2023", true);
    
            // Envia a requisição
            xhr.send();
    
    
            //
            document.getElementById('select-turma').addEventListener('change', ()=>{
                document.getElementById('alunos-lista').innerHTML = ''
                // Cria um novo objeto XMLHttpRequest
                var xhr = new XMLHttpRequest();
    
                // Configura a função de callback para quando a requisição estiver pronta
                xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // A resposta da requisição estará em xhr.responseXML
                    var xmlResponse = xhr.responseXML;
        
                    const alunos = xmlResponse.getElementsByTagName('wsAluno')
                    
    
                    for(let i = 0; i <= alunos.length; i++){
                        if(alunos[i].childNodes[37].innerHTML == document.getElementById('select-turma').value){
                            function picture(){
                                // Cria um novo objeto XMLHttpRequest
                                var xhr = new XMLHttpRequest();
    
                                // Configura a função de callback para quando a requisição estiver pronta
                                xhr.onreadystatechange = function() {
                                if (xhr.readyState === 4 && xhr.status === 200) {
                                    // A resposta da requisição estará em xhr.responseXML
                                    var xmlResponse = xhr.responseXML;
                                    const foto = xmlResponse.getElementsByTagName('wsFotoApp')
                                    document.getElementById(alunos[i].childNodes[3].innerHTML).style.backgroundImage = 'url(' + 'data:image/jpeg;base64,' + foto[0].childNodes[7].innerHTML + ')'
                                }
                                };
    
                                // Abre uma requisição GET para a URL da API que retorna XML
                                xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetImageApp?nCodigoCliente=" + codClienteUnidadeIV + "&nAlunoID=" + alunos[i].childNodes[3].innerHTML + "&nResponsavelID=0&sToken=" + tokenUnidadeIV, true);
    
                                // Envia a requisição
                                xhr.send();
    
                            
                            }
                            document.getElementById('alunos-lista').innerHTML += '<li> <ul class="data-aluno"> <li class="data-list"> <div class="picture" id="' + alunos[i].childNodes[3].innerHTML + '"></div></li> <li class="name" id="name">' + alunos[i].childNodes[5].innerHTML + '</li> </ul> </li>'
                            picture()
                            setTimeout(()=>{
                                const alunos = document.querySelectorAll('.data-aluno');
                                const foto = document.querySelectorAll('.alunos-lista .picture');
                
                                alunos.forEach(aluno => {
                                    aluno.addEventListener('click', () => {
                                        const picture = aluno.querySelector('.picture').style.backgroundImage
                                        const nomeAluno = aluno.querySelector('.name').innerHTML
                                        const modal = document.getElementById('modal-opcoes');
                                        const nameProfile = document.getElementById('name-profile');
                                        const background = document.getElementById('black-background');
                                        const profilePicture = document.getElementById('photo')
                                        const footer = document.getElementById('footer')
                
                                        nameProfile.innerHTML = nomeAluno;
                                        profilePicture.style.backgroundImage = picture
                                        background.style.display = 'block'
                                        modal.style.display = 'block';
                                        footer.style.display = 'none'
                                        document.getElementById('select-unidade').style.display = 'none'
                                    });
                                });
                    
                                const modal = document.getElementById('modal-opcoes');
                                const background = document.getElementById('black-background');
                                const footer = document.getElementById('footer')
                                modal.addEventListener('click', (event) => {
                                    if (event.target === modal) {
 
                                    }
                                }, );
                            })
                        }
                    }
                }
                };
                
                // Abre uma requisição GET para a URL da API que retorna XML
                xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetAlunos2?nCodigoCliente=" + codClienteUnidadeIV + "&sToken=" + tokenUnidadeIV + "&sParametrosBusca=Nome=", true);
        
                // Envia a requisição
                xhr.send();
    
    
    
            })
        }

        if(localStorage.getItem('user_classroom_app_local') == 'unidadeI'){
            unidadeI()
            document.getElementById('selected-locate').innerHTML = 'Unidade I - Mananciais'
        }
        
        if(localStorage.getItem('user_classroom_app_local') == 'unidadeII'){
            unidadeII()
            document.getElementById('selected-locate').innerHTML = 'Unidade II - Tindiba'
        }
        
        if(localStorage.getItem('user_classroom_app_local') == 'unidadeIV'){
            unidadeIV()
            document.getElementById('selected-locate').innerHTML = 'Unidade IV - Recreio'
        }

        //Abrir seletor de unidade
        document.getElementById('footer').addEventListener('click', ()=>{
            if(document.getElementById('select-unidade').style.display != 'block'){
                document.getElementById('select-unidade').style.display = 'block'
            }else{
                document.getElementById('select-unidade').style.display = 'none'
            }
            
        })

        //Selecionar a Unidade

        document.getElementById('mananciais').addEventListener('click', ()=>{
            localStorage.setItem('user_classroom_app_local', 'unidadeI')
            document.getElementById('select-unidade').style.display = 'none'
            document.getElementById('select-turma').innerHTML = '<option value="">--Selecione a Turma--</option>'
            document.getElementById('alunos-lista').innerHTML = ''
            window.location.reload()
        })

        document.getElementById('tindiba').addEventListener('click', ()=>{
            localStorage.setItem('user_classroom_app_local', 'unidadeII')
            document.getElementById('select-unidade').style.display = 'none'
            document.getElementById('select-turma').innerHTML = '<option value="">--Selecione a Turma--</option>'
            document.getElementById('alunos-lista').innerHTML = ''
            window.location.reload()
        })

        document.getElementById('recreio').addEventListener('click', ()=>{
            localStorage.setItem('user_classroom_app_local', 'unidadeIV')
            document.getElementById('select-unidade').style.display = 'none'
            document.getElementById('select-turma').innerHTML = '<option value="">--Selecione a Turma--</option>'
            document.getElementById('alunos-lista').innerHTML = ''
            window.location.reload()
        })
        

    }


})



//Fechar Modal
document.getElementById('black-background').addEventListener('click', (e)=>{
    if(e.target.id == 'black-background' || e.target.id == ''){
        document.getElementById('modal-opcoes').style.display = 'none'
        document.getElementById('black-background').style.display = 'none'
        document.getElementById('footer').style.display = 'block'
        const materialCheck = document.getElementById('material-check').checked = false
        const indisciplinaCheck = document.getElementById('indisciplina-check').checked = false
        const celularCheck = document.getElementById('celular-check').checked = false
        const atividadeCheck = document.getElementById('atividade-check').checked = false
    }
})

//Enviando para a Planilha
document.getElementById('send-ocorrence').addEventListener('click', ()=>{
    const agora = new Date();
    const dia = agora.getDate().toString().padStart(2, '0');
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
    const ano = agora.getFullYear().toString();
    const dataApp = `${dia}/${mes}/${ano}`;


    const professor = localStorage.getItem('user_classroom_app_name')
    const disciplina = document.getElementById('function-select').value
    const nome = document.getElementById('name-profile').innerHTML
    const turma = document.getElementById('select-turma').value

    //Checks
    const materialCheck = document.getElementById('material-check').checked
    const indisciplinaCheck = document.getElementById('indisciplina-check').checked
    const celularCheck = document.getElementById('celular-check').checked
    const atividadeCheck = document.getElementById('atividade-check').checked
    let indisciplina;
    let material
    let celular
    let atividade
    if(indisciplinaCheck == true){
        indisciplina = 'Sim'
    }else{
        indisciplina = 'Não'
    }

    if(materialCheck == true){
        material = 'Sim'
    }else{
        material = 'Não'
    }

    if(celularCheck == true){
        celular = 'Sim'
    }else{
        celular = 'Não'
    }

    if(atividadeCheck == true){
        atividade = 'Sim'
    }else{
        atividade = 'Não'
    }

    const classes = document.getElementById('select-turma').value
    const location = document.getElementById('selected-locate').innerHTML

    let link

    if (location == 'Unidade I - Mananciais'){
        link = 'https://api.sheetmonkey.io/form/7wCpvLqjCvYEiZpGXDqW57'
    }

    if(location == 'Unidade II - Tindiba'){
        link = 'https://api.sheetmonkey.io/form/tYA1zMtXeZgXD7oFSuFjgz'
    }

    if(location == 'Unidade IV - Recreio' && classes == '1º AM - 2023' ||location == 'Unidade IV - Recreio' && classes == '1º CN / EPCAR - 2023' ||location == 'Unidade IV - Recreio' && classes == '2ª CN / EPCAR - 2023' ||location == 'Unidade IV - Recreio' && classes == '2º AM - 2023' ||location == 'Unidade IV - Recreio' && classes == '3º AM - 2023'){
        link = 'https://api.sheetmonkey.io/form/h7bc25Ag6vuJi2XgiFXdM3'
    }
    
    if(location == 'Unidade IV - Recreio' && classes == '1º AM - 2023' ||location == 'Unidade IV - Recreio' && classes == '6AM - 2023' ||location == 'Unidade IV - Recreio' && classes == '7AM - 2023' ||location == 'Unidade IV - Recreio' && classes == '8AM - 2023' ||location == 'Unidade IV - Recreio' && classes == '9AM - 2023' ||location == 'Unidade IV - Recreio' && classes == '9º CN / EPCAR - 2023'){
        link = 'https://api.sheetmonkey.io/form/ePkVRdcQF4VUEJEHSnBQPo'
    }

    
    fetch(link, {
        method: 'post',
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
                    Professor: professor,
                    Matéria: disciplina,
                    Aluno: nome, 
                    Turma: turma, 
                    Data: dataApp,
                    'S/Material': material,
                    'Uso de Celular': celular,
                    'S/ Atividade de Casa': atividade,
                    Indisciplina: indisciplina
                })
    }).then(()=>{
        document.getElementById('confirm-env').style.display = 'block'
        document.getElementById('modal-opcoes').style.display = 'none'
        document.getElementById('black-background').style.display = 'none'
        document.getElementById('material-check').checked = false
        document.getElementById('indisciplina-check').checked = false
        document.getElementById('celular-check').checked = false
        document.getElementById('atividade-check').checked = false
        document.getElementById('footer').style.display = 'block'
        setTimeout(()=>{
            document.getElementById('confirm-env').style.display = 'none'
        }, 1000*2)
    })
})

//Opções do menu
document.getElementById('options').addEventListener('click', ()=>{
    if(document.getElementById('modal-config').style.display != 'block'){
        document.getElementById('modal-config').style.display = 'block'
    }else{
        document.getElementById('modal-config').style.display = 'none'
    }
})

document.getElementById('admin').addEventListener('click', ()=>{
    window.location.assign('./admin')
})

document.getElementById('exit').addEventListener('click', ()=>{
    localStorage.removeItem('user_classroom_app_name')
    localStorage.removeItem('user_classroom_app_functions')
    localStorage.removeItem('user_classroom_app_function')
    localStorage.removeItem('user_classroom_app_email')
    localStorage.removeItem('user_classroom_app_local')
    window.location.reload()
})



