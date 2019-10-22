const getDataset = (param  => new Promise((resolve, reject) => {
    const constraints = [
		{
            _field: 'param',
            _initialValue: param,
            _finalValue: param,
            _type: 1,
            _likeSearch: false,
        }
	];

    const datasetOptions = {
        name: 'ds_name',
        fields: [],
        constraints,
        order: [],
    };

    fetch(window.location.origin + '/api/public/ecm/dataset/datasets', {
        method: 'POST',
        redirect: 'follow',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(datasetOptions),
    }).then(response => response.json()).then((data) => {
		resolve(data);
    }).catch((error) => {
        reject(error);
    });
}));