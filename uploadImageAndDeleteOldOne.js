const deleteDocument = (documentId => new Promise((resolve, reject) => {
    fetch(window.location.origin + '/api/public/2.0/documents/deleteDocument/' + documentId, {
        method: 'POST',
        redirect: 'follow',
    }).then(response => response.json()).then(() => {
        resolve(true);
    }).catch((error) => {
        toast('Houve um erro ao deletar a imagem. Contate o suporte da IV2 via suporte@iv2.com.br.', 'danger');
        reject(error);
    });
}));

const saveImageAndDeleteOldOne = ((file) => new Promise(async (resolve) => {
    let imageDeleted = false;
    let documentId = '';

    // Pega id da imagem anterior
    documentId = container.querySelector('.hiddenId').value;

    // Caso haja, deleta imagem anterior
    if (documentId) {
        imageDeleted = await deleteDocument(documentId);
    }

    // Salva imagem no GED, retorna id e downloadURL
    const idAndURL = await saveDocumentOnGED(file);

    if (imageDeleted && idAndURL) {
        toast('Imagem atualizada. A imagem anterior foi deletada.');
        resolve();
    } else if (!imageDeleted && idAndURL) {
        toast('Imagem atualizada.');
        resolve();
    }
}));

document.querySelector('#meuInputTypeFile').addEventListener((event) => {
  const file = event.files[0];
  saveImageAndDeleteOldOne(file);
});