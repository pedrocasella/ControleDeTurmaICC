import { getDatabase, ref, set, push, child, get, remove, onValue} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
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
    const authorizedUsersRef = ref(database, 'icone_id/equipe');
    get(authorizedUsersRef)
        .then((snapshot) => {
            let emailExists = false;

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email === storedEmail && userData.appsAutorizados.includes('controledeturma.app')) {
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
    const authorizedUsersRef = ref(database, 'icone_id/equipe');
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
                        select.innerHTML += '<option value="' + turmas[i].childNodes[3].innerHTML + '">' + turmas[i].childNodes[3].innerHTML.replace('- 2024', '') + '</option>'
                    }
                    
                }
            }
            };
    
            // Abre uma requisição GET para a URL da API que retorna XML
            xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetTurmas?nCodigoCliente=" + codClienteUnidadeI + "&sToken=" + tokenUnidadeI + "&sParametrosBusca=AnoLetivo=2024", true);
    
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
         select.innerHTML += '<option value="' + turmas[i].childNodes[3].innerHTML + '">' + turmas[i].childNodes[3].innerHTML.replace('- 2024', '') + '</option>'
     }
     
 }
}
};

// Abre uma requisição GET para a URL da API que retorna XML
xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetTurmas?nCodigoCliente=" + codClienteUnidadeII + "&sToken=" + tokenUnidadeII + "&sParametrosBusca=AnoLetivo=2024", true);

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
                        select.innerHTML += '<option value="' + turmas[i].childNodes[3].innerHTML + '">' + turmas[i].childNodes[3].innerHTML.replace('- 2024', '') + '</option>'
                    }
                    
                }
            }
            };
    
            // Abre uma requisição GET para a URL da API que retorna XML
            xhr.open("GET", "https://api.sponteeducacional.net.br/WSAPIEdu.asmx/GetTurmas?nCodigoCliente=" + codClienteUnidadeIV + "&sToken=" + tokenUnidadeIV + "&sParametrosBusca=AnoLetivo=2024", true);
    
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
        const inspetorCheck = document.getElementById('inspetor-check').checked = false
        const uniformeCheck = document.getElementById('uniforme-check').checked = false
        const presencaChecked = document.getElementById('sala-check').checked = false
        const comentarios = document.getElementById('comentario-input').value = ''
    }
})

//Enviando para a Planilha


    document.getElementById('send-ocorrence').addEventListener('click', async ()=>{
        const inspetorCheck = document.getElementById('inspetor-check').checked
        if(inspetorCheck == false){
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
            const uniformeCheck = document.getElementById('uniforme-check').checked
            const presencaChecked = document.getElementById('sala-check').checked
            const comentarios = document.getElementById('comentario-input').value
            let indisciplina;
            let material
            let celular
            let atividade
            let uniforme
            let foraDeSala

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

            if(uniformeCheck == true){
                uniforme = 'Sim'
            }else{
                uniforme = 'Não'
            }

            if(presencaChecked == true){
                foraDeSala = 'Sim'
            }else{
                foraDeSala = 'Não'
            }
        
            const classes = document.getElementById('select-turma').value
            const location = document.getElementById('selected-locate').innerHTML
        
            let link
        
            if (location == 'Unidade I - Mananciais'){
                link = 'https://api.sheetmonkey.io/form/rpYvM1ht4YEYVB26CqWiJr'
            }
        
            if(location == 'Unidade II - Tindiba'){
                link = 'https://api.sheetmonkey.io/form/uK2yeZCRYLEHtB3MvXkHyw'
            }
        
            if(location == 'Unidade IV - Recreio'){
                link = 'https://api.sheetmonkey.io/form/rYuEc33Y75HUhCsYokMoh2'
            }
        
            // Adicione o campo oculto para indicar a folha desejada
            const worksheetField = document.createElement('input');
            worksheetField.type = 'hidden';
            worksheetField.name = 'x-sheetmonkey-insert-worksheet';
        
            // Substitua 'Sheet2' pelo nome da folha desejada
            worksheetField.value = turma;
        
            // Crie um formulário dinamicamente
            const form = document.createElement('form');
            form.method = 'post';
            form.action = link;
        
            // Anexe os dados ao formulário
            form.appendChild(createInput('Professor', professor));
            form.appendChild(createInput('Disciplina/ Função', disciplina));
            form.appendChild(createInput('Aluno', nome));
            form.appendChild(createInput('Turma', turma));
            form.appendChild(createInput('Data', dataApp));
            form.appendChild(createInput('Indisciplina', indisciplina));
            form.appendChild(createInput('Uso de Celular', celular));
            form.appendChild(createInput('S/ Uniforme', uniforme));
            form.appendChild(createInput('S/Material', material));
            form.appendChild(createInput('S/ Atividade de Casa', atividade));
            form.appendChild(createInput('Fora de Sala', foraDeSala));
            form.appendChild(createInput('Comentário', comentarios));
        
            // Adicione o campo oculto ao formulário
            form.appendChild(worksheetField);
        
            // Realize a solicitação usando fetch
            try {
                const response = await fetch(link, {
                    method: 'post',
                    body: new FormData(form),
                });
        
                if (response.ok) {
                    // Execute o código desejado após a submissão do formulário
                    document.getElementById('confirm-env').style.display = 'block';
                    document.getElementById('modal-opcoes').style.display = 'none';
                    document.getElementById('black-background').style.display = 'none';
                    document.getElementById('material-check').checked = false;
                    document.getElementById('indisciplina-check').checked = false;
                    document.getElementById('celular-check').checked = false;
                    document.getElementById('atividade-check').checked = false;
                    document.getElementById('inspetor-check').checked = false
                    document.getElementById('uniforme-check').checked = false
                    document.getElementById('sala-check').checked = false
                    document.getElementById('comentario-input').value = ''
                    document.getElementById('footer').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('confirm-env').style.display = 'none';
                    }, 1000 * 2);
                } else {
                    console.error('Erro na solicitação:', response.statusText);
                }
            } catch (error) {
                console.error('Erro na solicitação:', error);
            }
    
        

        }else{
            const agora = new Date();
            const dia = agora.getDate().toString().padStart(2, '0');
            const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
            const ano = agora.getFullYear().toString();
            const hora = agora.getHours().toString()
            const minuto = agora.getMinutes()
            let minute = ''; if(minuto < 10){minute = '0' + agora.getMinutes()}else{minute = agora.getMinutes().toString()}
            const dataApp = `${dia}/${mes}/${ano}`;
            const dataOcorrence = `${hora}:${minute}`
        
        
            const professor = localStorage.getItem('user_classroom_app_name')
            const disciplina = document.getElementById('function-select').value
            const nome = document.getElementById('name-profile').innerHTML
            const turma = document.getElementById('select-turma').value
        
            const unidade = localStorage.getItem('user_classroom_app_local')
            const inspetorRef = ref(database, 'controledeturma/inspecao/' + unidade)
            const pushInspetor = push(inspetorRef)

            const materialCheck = document.getElementById('material-check').checked  // Sem Material
            const indisciplinaCheck = document.getElementById('indisciplina-check').checked // Aluno Indisciplinado
            const celularCheck = document.getElementById('celular-check').checked // Uso de Celular
            const atividadeCheck = document.getElementById('atividade-check').checked // Sem Atividade de Casa
                            //Checks
                            const uniformeCheck = document.getElementById('uniforme-check').checked
                            const presencaChecked = document.getElementById('sala-check').checked
                            const comentarios = document.getElementById('comentario-input').value
                            let indisciplina;
                            let material
                            let celular
                            let atividade
                            let uniforme
                            let foraDeSala
                            const ocorrencia = [];

                            if(indisciplinaCheck == true){
                                indisciplina = 'Sim'
                                ocorrencia.push('Aluno Indisciplinado');
                            }else{
                                indisciplina = 'Não'
                            }
                        
                            if(materialCheck == true){
                                material = 'Sim'
                                ocorrencia.push('Sem Material');
                            }else{
                                material = 'Não'
                            }
                        
                            if(celularCheck == true){
                                celular = 'Sim'
                                ocorrencia.push('Uso de Celular');
                            }else{
                                celular = 'Não'
                            }
                        
                            if(atividadeCheck == true){
                                atividade = 'Sim'
                                ocorrencia.push('Sem Atividade de Casa');
                            }else{
                                atividade = 'Não'
                            }
            
                            if(uniformeCheck == true){
                                uniforme = 'Sim'
                                ocorrencia.push('Sem Uniforme Escolar');
                            }else{
                                uniforme = 'Não'
                            }
            
                            if(presencaChecked == true){
                                foraDeSala = 'Sim'
                                ocorrencia.push('O Aluno não está na sala');
                            }else{
                                foraDeSala = 'Não'
                            }



            set(pushInspetor, {
                professor: professor,
                funcao: disciplina,
                aluno: nome,
                ocorrencia: ocorrencia,
                turma: turma,
                hora: dataOcorrence,
                indisciplina: indisciplina,
                material: material,
                celular: celular,
                atividade: atividade,
                uniforme: uniforme,
                presenca: foraDeSala,
                comentarios: comentarios,
                uuid: pushInspetor.key
            }).then(()=>{
                    // Execute o código desejado após a submissão do formulário
                    document.getElementById('confirm-env').style.display = 'block';
                    document.getElementById('modal-opcoes').style.display = 'none';
                    document.getElementById('black-background').style.display = 'none';
                    document.getElementById('material-check').checked = false;
                    document.getElementById('indisciplina-check').checked = false;
                    document.getElementById('celular-check').checked = false;
                    document.getElementById('atividade-check').checked = false;
                    document.getElementById('uniforme-check').checked =false
                    document.getElementById('sala-check').checked = false
                    document.getElementById('inspetor-check').checked = false
                    document.getElementById('comentario-input').value = ''
                    document.getElementById('footer').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('confirm-env').style.display = 'none';
                    }, 1000 * 2);
            })
        }
    });

        // Função para criar elementos input
        function createInput(name, value) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            return input;
        }

//Inspetor
const unidade = localStorage.getItem('user_classroom_app_local')
const inspetorRef = ref(database, 'controledeturma/inspecao/' + unidade + '/')
const userClassroomEmail = localStorage.getItem('user_classroom_app_email');

const inspetoresRef = ref(database, 'controledeturma/inspetores/')

get(inspetoresRef).then((snapshot)=>{
    const data = snapshot.val()
    const inspetores = JSON.stringify(Object.values(data))
    
    if (inspetores.indexOf(userClassroomEmail) != -1) {
        async function respInspetor(professor, aluno, disciplina, turma, indisciplina, material, celular, atividade, uniforme, presenca, comentarios){
            const agora = new Date();
            const dia = agora.getDate().toString().padStart(2, '0');
            const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
            const ano = agora.getFullYear().toString();
            const dataApp = `${dia}/${mes}/${ano}`;
    
            const classes = document.getElementById('select-turma').value
            const location = document.getElementById('selected-locate').innerHTML
    
            let link
                
            if (location == 'Unidade I - Mananciais'){
                link = 'https://api.sheetmonkey.io/form/rpYvM1ht4YEYVB26CqWiJr'
            }
    
            if(location == 'Unidade II - Tindiba'){
                link = 'https://api.sheetmonkey.io/form/uK2yeZCRYLEHtB3MvXkHyw'
            }
    
            if(location == 'Unidade IV - Recreio'){
                link = 'https://api.sheetmonkey.io/form/rYuEc33Y75HUhCsYokMoh2'
            }
    
    
            // Adicione o campo oculto para indicar a folha desejada
            const worksheetField = document.createElement('input');
            worksheetField.type = 'hidden';
            worksheetField.name = 'x-sheetmonkey-insert-worksheet';
    
            const inspetor = localStorage.getItem('user_classroom_app_name')
    
            worksheetField.value = turma;
    
            // Crie um formulário dinamicamente
            const form = document.createElement('form');
            form.method = 'post';
            form.action = link;
                    // Anexe os dados ao formulário
                    form.appendChild(createInput('Professor', professor));
                    form.appendChild(createInput('Disciplina/ Função', disciplina));
                    form.appendChild(createInput('Aluno', aluno));
                    form.appendChild(createInput('Turma', turma));
                    form.appendChild(createInput('Data', dataApp));
                    form.appendChild(createInput('Indisciplina', indisciplina));
                    form.appendChild(createInput('Uso de Celular', celular));
                    form.appendChild(createInput('S/ Uniforme', uniforme));
                    form.appendChild(createInput('S/Material', material));
                    form.appendChild(createInput('S/ Atividade de Casa', atividade));
                    form.appendChild(createInput('Fora de Sala', presenca));
                    form.appendChild(createInput('Comentário', comentarios));
                    form.appendChild(createInput('Inspetor', inspetor));
    
            // Adicione o campo oculto ao formulário
            form.appendChild(worksheetField);
    
            // Realize a solicitação usando fetch
            try {
                const response = await fetch(link, {
                    method: 'post',
                    body: new FormData(form),
                });
    
                if (response.ok) {
                    // Execute o código desejado após a submissão do formulário
                    document.getElementById('confirm-env').style.display = 'block';
                    document.getElementById('modal-opcoes').style.display = 'none';
                    document.getElementById('black-background').style.display = 'none';
                    document.getElementById('material-check').checked = false;
                    document.getElementById('indisciplina-check').checked = false;
                    document.getElementById('celular-check').checked = false;
                    document.getElementById('atividade-check').checked = false;
                    document.getElementById('inspetor-check').checked = false
                    document.getElementById('footer').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('confirm-env').style.display = 'none';
                    }, 1000 * 2);
                } else {
                    console.error('Erro na solicitação:', response.statusText);
                }
            } catch (error) {
                console.error('Erro na solicitação:', error);
            }
        }
    
        //Resposta do Inspetor
        document.getElementById('inspetor-area').addEventListener('click', (e)=>{
            const uuid = e.target.dataset.alertUuid
            const messageUuid = e.target.dataset.messageUuid

            if(messageUuid != undefined){
                document.getElementById('comment-area-black').style.display = 'block'
                const ocorrenceRef = ref(database, 'controledeturma/inspecao/' + unidade + '/' + messageUuid)
                get(ocorrenceRef).then((snapshot)=>{
                    const data = snapshot.val()
                    console.log(data.comentarios)
                    document.querySelector('.nome-comment').innerText = data.aluno
                    document.querySelector('.turma-comment').innerText = data.turma
                    document.querySelector('.ocorrencia-comment').innerText = data.ocorrencia[0]
                    document.querySelector('.professor-comment').innerText = data.professor
                    document.querySelector('.disciplina-comment').innerText = data.funcao
                    document.getElementById('comentarios-comment').value = data.comentarios
                    document.getElementById('send-ocorrence-btn').dataset.alertUuid = data.uuid
                })
            }

            if(uuid != undefined){
                const unidade = localStorage.getItem('user_classroom_app_local')
                const ocorrenceRef = ref(database, 'controledeturma/inspecao/' + unidade + '/' + uuid)
                get(ocorrenceRef).then((snapshot)=>{
                    const data = snapshot.val()
    
    
                    const professor = data.professor
                    const aluno = data.aluno
                    const disciplina = data.funcao
                    const turma = data.turma
                    const indisciplina = data.indisciplina
                    const material = data.material
                    const celular = data.celular
                    const atividade = data.atividade
                    const uniforme = data.uniforme
                    const presenca = data.presenca
                    const comentarios = document.getElementById('comentarios-comment').value
                    
                    respInspetor(professor, aluno, disciplina, turma, indisciplina, material, celular, atividade, uniforme, presenca, comentarios).then(()=>{
                        remove(ocorrenceRef).then(()=>{
                            document.getElementById('comentarios-comment').value = ''
                            document.getElementById('comment-area-black').style.display = 'none'
                            document.getElementById('ocorrence-' + uuid).remove()
                        })
                        
                    })
                    
    
                })
    
            }
        })

        document.getElementById('comment-area-black').addEventListener('click', (e)=>{
            if(e.target.id == 'close-comment' || e.target.id == 'comment-area-black'){
                document.getElementById('comment-area-black').style.display = 'none'
            }
        })
    
            //Contador
            onValue(inspetorRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const totalAlunos = Object.keys(data).length;
                    document.getElementById('inspect-counter').innerText = totalAlunos
                    document.getElementById('ocorrencias-area').innerHTML = ''
                    Object.values(data).forEach((data)=>{
                        document.getElementById('ocorrencias-area').innerHTML += '<div class="ocorrence" id="ocorrence-' + data.uuid + '"> <ul><li><div class="alert-icon"></div></li> <li> <p class="nome-aluno"><strong>' + data.aluno + '</strong></p> <p class="turma">' + data.turma + '</p> </li> <li class="ocorrencia">' + data.ocorrencia[0] + '<p class"time">' + data.hora + '</p></li><li data-message-uuid="' + data.uuid + '"><div class="message-icon" data-message-uuid="' + data.uuid + '"></div></li> </ul> </div>'
                    })
                } else {
                    const totalAlunos = 0
                    document.getElementById('inspect-counter').innerText = totalAlunos
                }
            });
        
            // Verifica se o navegador suporta notificações
            if ("Notification" in window) {
                // Solicita permissão para exibir notificações
                Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                        // Configura o listener para as atualizações nos dados
                        const inspetorRef = ref(database, 'controledeturma/inspecao/' + unidade);

                        // Cria uma notificação com som
                        const createNotification = (totalAlunos) => {
                            const notification = new Notification("Controle e Gestão de Sala de Aula", {
                                body: `Casos Urgentes em Sala: ${totalAlunos}`,
                                icon: './img/iconecontrolelogo.png', // substitua pelo caminho do seu ícone
                                silent: false // definido como true para desabilitar o som, ou false para habilitar
                            });

                            // Adiciona um som personalizado à notificação
                            const audio = new Audio('./sounds/001.wav'); // substitua pelo caminho do seu som

                            // Aguarde até que a notificação seja exibida e, em seguida, reproduza o som
                            notification.onshow = () => {
                                audio.play();
                            };
                        };

                        onValue(inspetorRef, (snapshot) => {
                            const data = snapshot.val();
                            if (data) {
                                const totalAlunos = Object.keys(data).length;
                                document.getElementById('inspect-counter').innerText = totalAlunos;

                                // Cria uma notificação quando há dados de inspeção
                                createNotification(totalAlunos);
                            } else {
                                console.log('Não há dados de inspeção de alunos.');
                            }
                        });
                    }
                });
            } else {
                console.log("Este navegador não suporta notificações web.");
            }
    
        document.getElementById('inspetor-float').style.display = 'block'
    } else {
        console.log('O email do inspetor não está definido no localStorage.');
    }
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

document.getElementById('close-inspetor-area').addEventListener('click', ()=>{
    document.getElementById('inspetor-area').style.display = 'none'
})

document.getElementById('inspetor-float').addEventListener('click', ()=>{
    document.getElementById('inspetor-area').style.display = 'block'
    document.getElementById('ocorrencias-area').innerHTML = ''
    get(inspetorRef).then((snapshot)=>{
        const data = snapshot.val()
        Object.values(data).forEach((data)=>{
            document.getElementById('ocorrencias-area').innerHTML += '<div class="ocorrence" id="ocorrence-' + data.uuid + '"> <ul><li><div class="alert-icon"></div></li> <li> <p class="nome-aluno"><strong>' + data.aluno + '</strong></p> <p class="turma">' + data.turma + '</p> </li> <li class="ocorrencia">' + data.ocorrencia[0] + '<p class"time">' + data.hora + '</p></li><li data-message-uuid="' + data.uuid + '"><div class="message-icon" data-message-uuid="' + data.uuid + '"></div></li> </ul> </div>'
        })
        
    })
})