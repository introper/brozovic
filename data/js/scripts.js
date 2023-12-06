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

document.querySelectorAll('.category').forEach(category => {
    category.addEventListener('click', function () {
        max = 4;
        filterImages(category.getAttribute('data-target'));
    });
});

if (window.innerWidth < 1300) {
    document.querySelectorAll(".main-link").forEach(function (link) {
        link.addEventListener("click", function (event) {

            event.preventDefault();
            var closestLi = findClosestParent(link, "li");
            var cats = closestLi ? closestLi.querySelector("ul") : null;
            var cat = cats ? cats.querySelectorAll("li") : [];
            var arrow = link.querySelector(".arrow");

            if (cats) {
                if (!cats.classList.contains("active-hov")) {
                    cats.classList.add("active-hov");

                    arrow.classList.add("rotated");
                } else {
                    window.location.href = link.getAttribute("href");
                }
            } else {
                window.location.href = link.getAttribute("href");
            }

        });
    });

    function findClosestParent(element, selector) {
        while (element && !element.matches(selector)) {
            element = element.parentElement;
        }
        return element;
    }
}

document.addEventListener("click", function (e) {
    if (e.target.closest(".hamburger")) {
        e.preventDefault();
        var liElements = document.querySelectorAll("nav ul li");
        var i = 500;

        liElements.forEach(function (li) {
            setTimeout(function () {
                li.classList.add("activated");
            }, i);

            i += 50;
        });

        e.target.closest(".hamburger").classList.add("active");
        document.querySelector("nav").classList.add("active");
        document.querySelector(".bg-nav").classList.add("active");
        document.documentElement.classList.add("remove");
    }
});

document.addEventListener("click", function (e) {
    if (e.target.closest("#close-nav")) {
        e.preventDefault();
        var activeHovUl = document.querySelector(".active-hov");
        if (activeHovUl) {
            activeHovUl.classList.remove("active-hov");
        }

        var liElements = document.querySelectorAll("nav ul li");

        liElements.forEach(function (li) {
            li.classList.remove("activated");
        });
        document.querySelector(".hamburger").classList.remove("active");
        document.querySelector("nav").classList.remove("active");
        document.querySelector(".bg-nav").classList.remove("active");
        document.querySelector("html").classList.remove("remove");
    }
});

document.addEventListener("click", function (e) {
    if (e.target.classList.contains('bg-nav')) {
        e.preventDefault();
        var activeHovUl = document.querySelector(".active-hov");
        if (activeHovUl) {
            activeHovUl.classList.remove("active-hov");
        }

        var liElements = document.querySelectorAll("nav ul li");

        liElements.forEach(function (li) {
            li.classList.remove("activated");
        });
        document.querySelector(".hamburger").classList.remove("active");
        document.querySelector("nav").classList.remove("active");
        document.querySelector(".bg-nav").classList.remove("active");
        document.documentElement.classList.remove("remove");
    }
});


document.addEventListener("keyup", function (e) {
    if (e.key === "Escape") {
        var activeHovUl = document.querySelector(".active-hov");
        if (activeHovUl) {
            activeHovUl.classList.remove("active-hov");
        }
        var liElements = document.querySelectorAll("nav ul li");

        liElements.forEach(function (li) {
            li.classList.remove("activated");
        });
        document.querySelector(".hamburger").classList.remove("active");
        document.querySelector("nav").classList.remove("active");
        document.querySelector(".bg-nav").classList.remove("active");
        document.querySelector("html").classList.remove("remove");
    }
});

document.addEventListener("click", function (e) {
    if (e.target.closest("#fake-search")) {
        e.preventDefault();

        var formElement = document.querySelector('.search-form');
        formElement.classList.add('active');
    }
});
// Kliknutí na dokument
document.addEventListener('click', function (event) {
    var formElement = document.querySelector('.search-form');

    // Ověření, zda kliknutí nebylo uvnitř prvku s třídou "search-part"
    if (!formElement.contains(event.target)) {
        formElement.classList.remove('active');
    }
});