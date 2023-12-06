function fixedHeader() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector(".header");

    if (scrollTop > 60) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fixedHeader();
});

window.addEventListener("scroll", function () {
    fixedHeader();
});
var lastScrollTop = 0;

window.addEventListener("scroll", function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var header = document.querySelector(".header");

    if (st > lastScrollTop) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }

    lastScrollTop = st;
});

fetch("./assets/src/products.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (products) {
        let placeholder = document.querySelector("#data-output");
        let categoriesHolder = document.querySelector(".category-holder");
        let out = "";
        let uniqueCategories = new Set();

        for (let product of products) {
            let formattedPrice = Number(product.price).toLocaleString("cs-CZ");

            uniqueCategories.add(product.category);

            let flagsHtml = "";
            for (let flag of product.flags) {
                let flagClass = "";
                if (flag === "Tip") {
                    flagClass = "tip";
                } else if (flag === "Novinka") {
                    flagClass = "new";
                } else if (flag === "Výprodej") {
                    flagClass = "sale";
                }
                flagsHtml += `<span class="flag ${flagClass}">${flag}</span>`;
            }

            let availabilityClass = "";
            if (product.availability === "Skladem") {
                availabilityClass = "stock";
            } else if (product.availability === "Momentálně nedostupné") {
                availabilityClass = "out";
            } else if (product.availability === "Na objednávku") {
                availabilityClass = "order";
            }

            out += `
            <div class="block-js" data-target="${product.category}"> 
                <div class="flags">${flagsHtml}</div>
                <div class="img"><img src='${product.imgSrc}'></div>
              
                <div class="holder ">  
                    <h3>${product.title}</h3>
                    <span class="state ${availabilityClass}">${product.availability}</span>
                    <span class="price">${formattedPrice} Kč</span>
                </div>
            </div> 
            `;
        }

        let isFirstCategory = true;
        for (let category of uniqueCategories) {
            let categoryClass = isFirstCategory ? "active" : "";
            categoriesHolder.innerHTML += `<span class="category ${categoryClass}" data-target="${category}" onclick="filterImages('${category}')">${category}</span>`;
            isFirstCategory = false;
        }

        placeholder.innerHTML = out;

        filterImages(uniqueCategories.values().next().value);
    })
    .catch(function (error) {
        console.log('Error fetching data: ', error);
    });


    let max = 4;
    let selectedCategory;
    
    function filterImages(category) {
        selectedCategory = category;
        let blocks = document.querySelectorAll('.block-js');
    
        let categories = document.querySelectorAll('.category');
        categories.forEach(category => {
            category.classList.remove('active');
        });
    
        let selectedCategoryElement = document.querySelector(`.category[data-target="${selectedCategory}"]`);
        if (selectedCategoryElement) {
            selectedCategoryElement.classList.add('active');
        }
    
        let match = 0;
    
        blocks.forEach(block => {
            let blockCategory = block.getAttribute('data-target');
    
            if (blockCategory === selectedCategory) {
                if (match < max) {
                    block.style.display = 'flex';
                } else {
                    block.style.display = 'none';
                }
                match++;
            } else {
                block.style.display = 'none';
            }
        });
        let btnBlock = document.querySelector('.btn-block-js');
        if (max >= match) {
            btnBlock.style.display = 'none';
        } else {
            btnBlock.style.display = 'flex';
        }
    }
    
    document.getElementById('load-more').addEventListener('click', function () {
        max += 4;
        filterImages(selectedCategory);
    });
    
    // Add event listener for category clicks
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', function () {
            max = 4; // Reset max value to 4
            filterImages(category.getAttribute('data-target'));
        });
    });
    




