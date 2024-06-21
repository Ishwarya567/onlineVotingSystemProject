function addOption() {
    const optionsDiv = document.getElementById('options');
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'options';
    input.placeholder = 'Option';
    input.required = true;
    input.className="form-control";
    inputGroup.appendChild(input);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button';
    deleteButton.className="btn btn-outline-dark"
    deleteButton.onclick = function() {
        optionsDiv.removeChild(inputGroup);
    };
    inputGroup.appendChild(deleteButton);

    optionsDiv.appendChild(inputGroup);
}