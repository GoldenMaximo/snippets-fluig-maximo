////////////////////////////////////////////// README /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Snippet Máximo 2019 /////////////////////////////////////////

// Sobe arquivos no GED. Mexa em nada, só copiar e colar, mude apenas o nome da sua empresa no toast.
// CTRL+C / CTRL+V total.

// Para utilizá-lo:

// uploadToGEDAndReturnItsDownloadURL(seu-arquivo-inteiro, id-da-pasta-onde-o-arquivo-vai);

// Pode me citar no código também se tiver boa vontade, github.com/GoldenMaximo/snippets-fluig-maximo

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////// Código ////////////////////////////////////////////////

// API 1: Grava documento no GED
const saveDocument = ((file, parentId) => new Promise((resolve, reject) => {
  const documentPack = {
      description: file.name,
      parentId,
      attachments: [{
          fileName: file.name,
      }],
  };

  fetch(window.location.origin + '/api/public/ecm/document/createDocument', {
      method: 'POST',
      redirect: 'follow',
      headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
      }),
      body: JSON.stringify(documentPack),
  }).then(response => response.json()).then((data) => {
      resolve(data);
  }).catch((error) => {
      reject(error);
  });
}));

// API 2: Retorno URL do documento gravado no GED
const getDocumentDownloadURL = (documentId => new Promise((resolve, reject) => {
    fetch(window.location.origin + '/api/public/2.0/documents/getDownloadURL/' + documentId).then(response => response.json()).then((data) => {
        resolve(data);
    }).catch((error) => {
        reject(error);
    });
}));

// Função: Grava documento no GED e retorna URL de visualização/download
const uploadToGEDAndReturnItsDownloadURL = (file, parentId) => new Promise((resolve, reject) => {
  // Mostra loading
  FLUIGC.loading(window).show();

  // Upload no temp do fluig, necessário. (Equivalente a JQuery Fileupload pra quem é oldschool)
  const data = new FormData();
  data.append('file', file);
  fetch('/ecm/upload', {
      method: 'POST',
      body: data,
  }).then(() => {
      // Grava documento no GED e retorna o documentId gerado.
      saveDocument(file, parentId).then((documentData) => {

          // Pega URL do documento através da API downloadURL
          getDocumentDownloadURL(documentData.content.id).then((downloadURL) => {

              // Encerra loading
              FLUIGC.loading(window).hide();
              resolve(downloadURL);

          }).catch((error) => {
              reject(error);
              FLUIGC.toast({
                message: 'Houve um erro ao carregar o arquivo. Contate o suporte da [SUA-EMPRESA-AQUI] via [EMAIL-DE-SUPORTE@EMAIL.COM].',
                type: 'danger'
              });
          });
      }).catch((error) => {
          reject(error);
          FLUIGC.toast({
            message: 'Houve um erro ao salvar o arquivo. Contate o suporte da [SUA-EMPRESA-AQUI] via [EMAIL-DE-SUPORTE@EMAIL.COM].',
            type: 'danger'
          });
      });
  }).catch((error) => {
      reject(error);
      FLUIGC.toast({
        message: 'Houve um erro ao criar o documento no GED. Contate o suporte da [SUA-EMPRESA-AQUI] via [EMAIL-DE-SUPORTE@EMAIL.COM].',
        type: 'danger'
      })
  });
});
