//https://stackoverflow.com/questions/23344776/how-to-access-data-of-uploaded-json-file -> access file
//https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript -> download file
//https://www.therogerlab.com/sandbox/pages/how-to-create-and-download-a-file-in-javascript?s=0ea4985d74a189e8b7b547976e7192ae.7213739ce01001e16cc74602189bfa09 --> download link file

//Submit Form Inputs
var formDescription = document.getElementById('description');
var formURL = document.getElementById('url');
var formFolder = document.getElementById('folder');

//Submit Form Button
var saveLinkButton = document.getElementById('saveLinkButton')

var linksJsonObject = [];

function OpenForm(){
    document.getElementById('form').classList.remove('hidden');
}

function CloseForm(){
    document.getElementById('form').classList.add('hidden');
}

function RefreshPage(){
    PopulateLinks();
    PopulateDropDownOptions();
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

function PopulateDropDownOptions(){
    var foldersParent = document.getElementById('folders');

    foldersParent.innerHTML = ""

    linksJsonObject.forEach(object => {
        foldersParent.innerHTML += 
        `
        <option value=${object.folder}>
        `
    })
}

function PopulateLinks(jsonObj){
    var linksParent = document.getElementById('linksParent');

    linksParent.innerHTML = "";

    linksJsonObject.forEach(object => {
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
                        <button onclick="OnDeleteButtonClick('${object.folder}','${link.description}')">delete</button>
                    </li>
                    `
            });
        
        
        linksParent.innerHTML += 
        `
            </ul>
        `

    })
}

function OnDeleteButtonClick(folder, description){
    DeleteLink(folder, description)
    RefreshPage()
}

function OpenEditLinkForm(folder, description){
    OpenForm();
    
    var f = linksJsonObject.filter(obj => obj.folder == folder)[0];
    var link = f.links.filter(l => l.description == description)[0];

    formDescription.value = link.description
    formURL.value = link.url
    formFolder.value = folder

    saveLinkButton.onclick = () => {
        DeleteLink(folder, link.description);
        AddLink(formFolder.value, formDescription.value, formURL.value);
        CloseForm();
        RefreshPage();
    }
}

function OpenAddLinkForm(){
    OpenForm();
    
    formDescription.value = ""
    formURL.value = ""
    formFolder.value = ""

    saveLinkButton.onclick = () => {
        AddLink(formFolder.value, formDescription.value, formURL.value);
        CloseForm();
        RefreshPage();
    }
}

function AddLink(folderName, description, url){

    var folder = linksJsonObject.filter(obj => obj.folder == folder)[0];

    if (folder == null){
        linksJsonObject.push({"folder":folderName, "links":[]})
        folder = linksJsonObject.filter(obj => obj.folder == folderName)[0];
    }
    folder.links.push({"description":description, "url":url})
}

function DeleteLink(folder, description){

    var folder = linksJsonObject.filter(obj => obj.folder == folder)[0];

    folder.links = folder.links.filter(link => link.description != description);

    linksJsonObject = linksJsonObject.filter(folder => folder.links.length > 0);
}

function DownloadLinkFile(){
  var content = JSON.stringify(linksJsonObject);

  var file = new File(["\ufeff"+content], 'links.json', {type: "text/plain:charset=UTF-8"});

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

document.getElementById('file').addEventListener('change', (event) => {

    var promise = ReadJSONFile(event.target.files[0]);

    promise.then(
        (value) => {
            linksJsonObject = value;
            RefreshPage();
        },
        (error) => {
            linksJsonObject = [];
            RefreshPage();
        }
    )
});