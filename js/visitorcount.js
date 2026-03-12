async function viewCount() {
    const wrapper = document.querySelector(".flex-row.grow-row.visitorcount");
    // get and increment visitor count
    let count;
    try {
         count = await fetch("https://phonehome.ws4k.net/api/visitor-count")
        .then((res) => {return res.text()});
    } catch (err) {
        console.error(err);
        wrapper.innerHTML = "";
        const str = " error! "
        for (let idx = 0; idx < str.length; idx++) {
            const itm = str.charAt(idx);
            wrapper.innerHTML += `<span>${itm}</span>`;
        }
    }
    // manipulate view count and turn it into an array
    count = count.padStart(8,"-");
    wrapper.innerHTML = "";
    for (let idx = 0; idx < count.length; idx++) {
        const itm = count.charAt(idx);
        if (itm === "-") {
            wrapper.innerHTML += `<span>0</span>`;
        } else {
            wrapper.innerHTML += `<span>${itm}</span>`;
        }
    };
};

viewCount();