//https://stackoverflow.com/questions/23344776/how-to-access-data-of-uploaded-json-file -> access file
//https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript -> download file
//https://www.therogerlab.com/sandbox/pages/how-to-create-and-download-a-file-in-javascript?s=0ea4985d74a189e8b7b547976e7192ae.7213739ce01001e16cc74602189bfa09 --> download link file

var uploadFile = document.getElementById('file');
var fileDownload = document.getElementById('fileDownload');
var linksParent = document.getElementById('linksParent');
var foldersParent = document.getElementById('folders');
var linkEditForm = document.getElementById('form');
var addLinkButton = document.getElementById('addLinkButton');

var linksJsonObject = [];

function OpenForm(){
    linkEditForm.classList.remove('hidden');
}

function CloseForm(){
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
    linksJsonObject = newValue;

    PopulateLinks(newValue);
    PopulateDropDownOptions(newValue);
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
                        <button onclick="OpenEditLinkForm('${object.folder}','${link.description}')">edit</button>
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

function OpenEditLinkForm(folder, description){
    OpenForm();
    
}

function OpenAddLinkForm(){
    OpenForm();
}

function EditLink(folder, description){
    alert(`${folder}    ${description}`);
    CloseForm();
}

function AddLink(folder, description, url){

}

function DeleteLink(folder, description){
    var jsonObjClone = JSON.parse(JSON.stringify(linksJsonObject)); 

    var folder = jsonObjClone.filter(obj => obj.folder == folder)[0];

    folder.links = folder.links.filter(link => link.description != description);

    jsonObjClone = jsonObjClone.filter(folder => folder.links.length > 0);

    SetJsonObject(jsonObjClone);

}

function DownloadLinkFile(){
    //create or obtain the file's content
  var content = JSON.stringify(linksJsonObject);

  //create a file and put the content, name and type
  var file = new File(["\ufeff"+content], 'myFile.txt', {type: "text/plain:charset=UTF-8"});

  //create a ObjectURL in order to download the created file
  url = window.URL.createObjectURL(file);

  //create a hidden link and set the href and click it
  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = file.name;
  a.click();
  window.URL.revokeObjectURL(url);
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