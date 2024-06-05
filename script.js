document.addEventListener('DOMContentLoaded', function () {
    const openFormBtn = document.getElementById('openFormBtn');
    const formPopup = document.getElementById('formPopup');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const dataForm = document.getElementById('dataForm');
    const dropZone = document.getElementById('dropZone');
    const dataDisplay = document.getElementById('dataDisplay');
    const changeImageCheckbox = document.getElementById('changeImage');
    const changeImageContainer = document.getElementById('changeImageContainer');
    const newImageInput = document.getElementById('newImageInput');
    const imageInputContainer = document.getElementById('imageInputContainer');
    const formTitle = document.getElementById('formTitle');

    let editIndex = -1;

    loadSavedData();

    openFormBtn.innerHTML = '&#128193;'; // 📂

    openFormBtn.addEventListener('click', function () {
        formPopup.style.display = 'block';
        editIndex = -1;
        changeImageContainer.style.display = 'none';
        imageInputContainer.style.display = 'block';
        formTitle.textContent = 'Enter Data';
    });

    closeFormBtn.addEventListener('click', function () {
        formPopup.style.display = 'none';
    });

    changeImageCheckbox.addEventListener('change', function () {
        if (this.checked) {
            newImageInput.style.display = 'block';
        } else {
            newImageInput.style.display = 'none';
        }
    });

    dataForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const imageInput = document.getElementById('image');
        const newImage = document.getElementById('newImage');
        const file = imageInput.files[0];
        const newFile = newImage.files[0];

        if (editIndex >= 0) {
            const savedData = JSON.parse(localStorage.getItem('data')) || [];
            savedData[editIndex].name = name;
            savedData[editIndex].description = description;

            if (changeImageCheckbox.checked && newFile) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    savedData[editIndex].imageUrl = event.target.result;
                    updateData(savedData[editIndex], editIndex);
                    formPopup.style.display = 'none';
                    dataForm.reset();
                };
                reader.readAsDataURL(newFile);
            } else {
                updateData(savedData[editIndex], editIndex);
                formPopup.style.display = 'none';
                dataForm.reset();
            }
        } else {
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const imageUrl = event.target.result;
                    const data = { name, description, imageUrl };
                    saveData(data);
                    displayData(data, JSON.parse(localStorage.getItem('data')).length - 1);
                    formPopup.style.display = 'none';
                    dataForm.reset();
                };
                reader.readAsDataURL(file);
            }
        }
    });

    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropZone.style.backgroundColor = '#f0f0f0';
    });

    dropZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        dropZone.style.backgroundColor = '#fff';
    });

    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.style.backgroundColor = '#fff';
        const files = e.dataTransfer.files;
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const imageUrl = event.target.result;
                    const name = 'Dropped Image';
                    const description = 'No description';
                    const data = { name, description, imageUrl };
                    saveData(data);
                    displayData(data, JSON.parse(localStorage.getItem('data')).length - 1);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    function displayData(data, index) {
        const dataItem = document.createElement('div');
        dataItem.className = 'data-item';
        dataItem.dataset.index = index;
        dataItem.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.description}</p>
            <img src="${data.imageUrl}" alt="${data.name}">
            <div class="actions">
                <button onclick="editData(${index})">✏️</button>
                <button onclick="deleteData(${index})">❌</button>
            </div>
        `;
        dataDisplay.appendChild(dataItem);
    }

    function saveData(data) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData.push(data);
        localStorage.setItem('data', JSON.stringify(savedData));
    }

    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData.forEach((data, index) => displayData(data, index));
    }

    window.deleteData = function (index) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(savedData));
        dataDisplay.innerHTML = '';
        loadSavedData();
    };

    window.editData = function (index) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        const data = savedData[index];
        document.getElementById('name').value = data.name;
        document.getElementById('description').value = data.description;
        formTitle.textContent = 'Edit Data';
        formPopup.style.display = 'block';
        changeImageContainer.style.display = 'block';
        newImageInput.style.display = 'none';
        imageInputContainer.style.display = 'none';
        editIndex = index;
    };

    function updateData(data, index) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData[index] = data;
        localStorage.setItem('data', JSON.stringify(savedData));
        dataDisplay.innerHTML = '';
        loadSavedData();
    }

    searchBox.addEventListener('input', function () {
        const query = searchBox.value.trim().toLowerCase(); // Trim and convert query to lowercase
        const dataItems = document.querySelectorAll('.data-item');
        dataItems.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase(); // Get lowercase text content
            const description = item.querySelector('p').textContent.toLowerCase(); // Get lowercase text content
            if (name.includes(query) || description.includes(query)) { // Check if name or description contains query
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

});
