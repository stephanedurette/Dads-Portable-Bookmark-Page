//https://stackoverflow.com/questions/23344776/how-to-access-data-of-uploaded-json-file -> access file
//https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript -> download file

var uploadFile = document.getElementById('file');
var fileDownload = document.getElementById('fileDownload');
var linksparent = document.getElementById('linksParent');

var linksJsonObject = null;
var downloadableTextFile = null;

function SetJsonObject(newValue){
    if (newValue == null){
        fileDownload.classList.add('hidden')
        linksparent.classList.add('hidden')
    } else {
        fileDownload.classList.remove('hidden')
        linksparent.classList.remove('hidden')
        PopulateLinks(newValue);
    }
    linksJsonObject = newValue;
    UpdateDownloadFile(linksJsonObject);
}

async function ReadJSONFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => {
        try {
            resolve(JSON.parse(event.target.result));
        } catch(err){
            reject(err);
        }
      }
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
}

function PopulateLinks(jsonObj){
    linksparent.innerHTML = "";
    jsonObj.forEach(link => {
        linksparent.innerHTML +=
            `
            <li>
                <b><a target=”_blank” href="${link.url}">${link.title}: </a></b>
                <div class="description">${link.description}</div>
                <button data-title="${link.title}">edit</button>
                <button data-title="${link.title}">delete</button>
            </li>
            `
    });
}

async function UpdateDownloadFile(jsonObj) {
    var data = new Blob([JSON.stringify(jsonObj)], {type: 'text/plain'});

    if (downloadableTextFile !== null) {
        window.URL.revokeObjectURL(downloadableTextFile);
    }

    downloadableTextFile = window.URL.createObjectURL(data);

    fileDownload.setAttribute('href', downloadableTextFile);
}

uploadFile.addEventListener('change', (event) => {
    var promise = ReadJSONFile(event.target.files[0]);

    promise.then(
        (value) => {
            SetJsonObject(value);
        },
        (error) => {
            SetJsonObject(null);
        }
    )
});