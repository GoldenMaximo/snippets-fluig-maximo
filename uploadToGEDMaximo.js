///////////////////////////////////////// Snippet Máximo 2019 /////////////////////////////////////////
// Sobe arquivos no GED. Mexa em nada, ignore TODO o código, mude apenas o nome da sua empresa no toast
// Para utilizá-lo:

// uploadToGEDAndReturnItsDownloadURL(seu-arquivo-inteiro, id-da-pasta-onde-o-arquivo-vai);

// Pode me citar no código também se tiver boa vontade, github.com/GoldenMaximo/snippets-fluig-maximo

///////////////////////////////////////////////////////////////////////////////////////////////////////

const saveDocumentAPI = ((file, parentId) => new Promise((resolve, reject) => {
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
      saveDocumentAPI(file, parentId).then((documentData) => {
          // Pega downloadURL através da api de pegar downloadURL

          getDocumentDownloadURL(documentData.content.id).then((downloadURL) => {

              FLUIGC.loading(window).hide();
              //Depois de ter carregado ele acaba o Loading..//
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
