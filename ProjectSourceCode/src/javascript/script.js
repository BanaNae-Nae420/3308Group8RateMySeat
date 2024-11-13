// ---  seat section dropdown menu code  ---
const sectionNum = [
    {start: 105, end: 150, label: '100s'},
    {start: 201, end: 247, label: '200s'},
    {start: 301, end: 346, label: '300s'}
    ];
    const dropdown = document.getElementById('sections');
    sectionNum.forEach( range => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = range.label;
        dropdown.appendChild(optgroup);
        for( let i = range.start; i <= range.end; i++)
        {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            dropdown.appendChild(option);
        }
    });
/////////////////////////////////////////////////