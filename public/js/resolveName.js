let nameFromEmail = window.localStorage.getItem('jumboGPSemail').split('@')
    nameFromEmail = nameFromEmail[0]
    document.querySelector('#navbarDropdownMenuLink').textContent = nameFromEmail