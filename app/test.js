function unidadeII(){
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
                        
                                    console.log(alunos[1].childNodes)
                    
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
                                                    });
                                                });
                                    
                                                const modal = document.getElementById('modal-opcoes');
                                                const background = document.getElementById('black-background');
                                                const footer = document.getElementById('footer')
                                                modal.addEventListener('click', (event) => {
                                                    if (event.target === modal) {
                                                        modal.style.display = 'none';
                                                        background.style.display = 'none'
                                                        footer.style.display = 'block'
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
        }
    
    
    })
}