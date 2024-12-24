//https://stackoverflow.com/questions/23344776/how-to-access-data-of-uploaded-json-file -> access file
//https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript -> download file

//replace title with categories, separate UL's for each category -> Folder = category, drop down menu :'(
//can edit folder names 

var uploadFile = document.getElementById('file');
var fileDownload = document.getElementById('fileDownload');
var linksParent = document.getElementById('linksParent');
var foldersParent = document.getElementById('folders');

var linkEditForm = document.getElementById('form');

var addLinkButton = document.getElementById('addLinkButton');

var linksJsonObject = null;
var downloadableTextFile = null;

function AddLink(){
    linkEditForm.classList.remove('hidden');
}

function CancelForm(){
    linkEditForm.classList.add('hidden');
}

function SubmitForm(){
    linkEditForm.classList.add('hidden');
}

linkEditForm.onsubmit = function(event) {
    event.preventDefault();
    return false;
}

function SetJsonObject(newValue){
    if (newValue == null){
        fileDownload.classList.add('hidden')
        linksParent.classList.add('hidden')
        addLinkButton.classList.add('hidden')
    } else {
        fileDownload.classList.remove('hidden')
        linksParent.classList.remove('hidden')
        addLinkButton.classList.remove('hidden')
        PopulateLinks(newValue);
        PopulateDropDownOptions(newValue);
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

function PopulateDropDownOptions(jsonObj){
    foldersParent.innerHTML = ""

    jsonObj.forEach(object => {
        foldersParent.innerHTML += 
        `
        <option value=${object.folder}>
        `
    })
}

function PopulateLinks(jsonObj){

    linksParent.innerHTML = "";

    jsonObj.forEach(object => {
        linksParent.innerHTML += 
        `
        <h2>${object.folder}</h2>
            <ul>
        `
        
        object.links.forEach(link => {
                linksParent.innerHTML +=
                    `
                    <li>
                        <b><a target=”_blank” href="${link.url}">${link.description}</a></b>
                        <button onclick="EditLink('${object.folder}','${link.description}')">edit</button>
                        <button onclick="DeleteLink('${object.folder}','${link.description}')">delete</button>
                    </li>
                    `
            });
        
        
        linksParent.innerHTML += 
        `
            </ul>
        `

    })
}

function EditLink(folder, description){
    alert(`${folder}    ${description}`);
}

function DeleteLink(folder, description){
    var jsonObjClone = JSON.parse(JSON.stringify(linksJsonObject)); 

    var folder = jsonObjClone.filter(obj => obj.folder == folder)[0];

    folder.links = folder.links.filter(link => link.description != description);

    jsonObjClone = jsonObjClone.filter(folder => folder.links.length > 0);

    SetJsonObject(jsonObjClone);

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