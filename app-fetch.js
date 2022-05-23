var root = document.getElementById("app");
var postMsg = document.getElementById("post-msg");
var clearSearch = document.getElementById("clear-search");
var pagWrapper = document.querySelector(".pagination-wrapper");
// var post_per_page = document.getElementById("post_per_page");
var url = "https://jsonplaceholder.typicode.com/posts";

var currentPage = 1;
var postPerPage = 9;
var paginationCount = 5;
var stage = 1;
var storeSearchedValue = "";

// post_per_page.addEventListener("change", function () {
//   postPerPage = this.value;
//   fetchPosts(stage);
// });

function fetchPosts(stage) {
  fetch(url)
    .then((res) => res.json())
    .then((posts) => {
      var allPosts = [];
      // console.log(stage);

      if (stage === 1) {
        allPosts = posts;
        getAllPosts(allPosts);
      }

      if (stage === 2) {
        clearSearch.classList.remove("disabled");
        posts.forEach((post) => {
          var title = post.title.toLowerCase();
          if (searchInput.value) {
            storeSearchedValue = searchInput.value.trim().toLowerCase();
          }
          postMsg.innerHTML = `Search result for: <strong>${storeSearchedValue}</strong>  `;

          if (title.indexOf(storeSearchedValue) > -1) {
            allPosts.push(post);
          }
        });

        filterBy.selectedIndex = 0;
        searchInput.value = "";
        getAllPosts(allPosts);
      }

      if (stage === 3) {
        clearSearch.classList.remove("disabled");
        var sortedPosts;

        allPosts = posts;
        postMsg.innerHTML = `Sort by: <strong class="text-capitalize">${selectedOpt}</strong>  `;

        if (selectedOpt === "Title") {
          sortedPosts = allPosts.sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          });
        }

        if (selectedOpt === "ID") {
          sortedPosts = allPosts.sort((a, b) => {
            if (a.id < b.id) {
              return -1;
            }
            if (a.id > b.id) {
              return 1;
            }
            return 0;
          });
        }

        if (selectedOpt === "Description") {
          sortedPosts = allPosts.sort((a, b) => {
            if (a.body < b.body) {
              return -1;
            }
            if (a.body > b.body) {
              return 1;
            }
            return 0;
          });
        }

        getAllPosts(sortedPosts);
      }
    })
    .catch((err) => console.log(err));
}
fetchPosts(stage);

if (clearSearch) {
  clearSearch.onclick = function () {
    postMsg.innerHTML = "";
    storeSearchedValue = "";
    stage = 1;
    fetchPosts(stage);
    clearSearch.classList.add("disabled");
  };
}

/* Get all posts */
function getAllPosts(allPosts) {
  // console.log(allPosts);
  var getData = pagination(allPosts, currentPage, postPerPage);

  var totalPosts = getData.posts;
  var totalPages = getData.totalPages;

  postStructure(totalPosts);
  paginationController(totalPages);
}

/* Post HTML */
function postStructure(totalPosts) {
  root.innerHTML = "";

  if (totalPosts.length === 0) {
    root.innerHTML = "<p>Not Found.!!</p>";
  }

  for (var i = 0; i < totalPosts.length; i++) {
    var title = "";

    /* highligh searched value */
    if (stage === 2) {
      var text = totalPosts[i].title;

      let re = new RegExp(storeSearchedValue, "g");
      let newText = text.replace(
        re,
        `<span class="highlight">${storeSearchedValue}</span>`
      );
      title = newText;
    } else {
      title = totalPosts[i].title;
    }

    /* sort by options */
    var output = `
                  <div class="card">
                     <div class="card-body">
                          <h5 class="text-capitalize"><span data-id="${totalPosts[i].id}">${totalPosts[i].id}</span>. ${title}</h5>
                          <p class="text-capitalize">${totalPosts[i].body}</p>
                      </div>
                  </div>
                  `;
    root.innerHTML += output;
  }
}

/* Pagination */
function pagination(data, currentPage, postPerPage) {
  var trimStart = (currentPage - 1) * postPerPage;
  var trimEnd = trimStart + postPerPage;

  var trimmedData = data.slice(trimStart, trimEnd);

  var pageCount = Math.ceil(data.length / postPerPage);

  return {
    posts: trimmedData,
    totalPages: pageCount,
  };
}

/* Pagination Controller */
function paginationController(totalPages) {
  pagWrapper.innerHTML = "";

  var leftCount = currentPage - Math.floor(paginationCount / 2);
  var rightCount = currentPage + Math.floor(paginationCount / 2);

  if (leftCount < 1) {
    leftCount = 1;
    rightCount = paginationCount;
  }

  if (rightCount > totalPages) {
    leftCount = totalPages - (paginationCount - 1);

    if (leftCount < 1) {
      leftCount = 1;
    }

    rightCount = totalPages;
  }

  var avg = Math.floor((leftCount + rightCount) / 2);
  console.log(avg);

  for (var i = leftCount; i <= rightCount; i++) {
    pagWrapper.innerHTML += `
        <li class="page-item ${
          i === currentPage ? "active" : ""
        }"><a href="javascript:void(0)"  class="page-link shadow-none" onClick=paginationHandler(${i})>${i}</a></li>`;
  }

  /* First */
  if (currentPage !== 1) {
    pagWrapper.innerHTML =
      `<li class="page-item"><a href="javascript:void(0)" class="page-link shadow-none" onClick=paginationHandler(${1})>&#171; First</a></li><li class="page-item"><a class="page-link shadow-none">...</a></li>` +
      pagWrapper.innerHTML;
  }

  /* Last */
  if (currentPage !== totalPages) {
    pagWrapper.innerHTML += `<li class="page-item"><a class="page-link shadow-none">...</a></li><li class="page-item"><a href="javascript:void(0)" class="page-link shadow-none" onClick=paginationHandler(${totalPages})>Last &#187;</a></li>`;
  }
}

// function paginationController(postPerPage, totalPages) {
//   pagWrapper.innerHTML = "";

//   var leftCount = currentPage - Math.floor(postPerPage / 2);
//   var rightCount = currentPage + Math.floor(postPerPage / 2);

//   if (leftCount < 1) {
//     leftCount = 1;
//     rightCount = postPerPage;
//   }

//   if (rightCount > totalPages) {
//     leftCount = totalPages - (postPerPage - 1);

//     if (leftCount < 1) {
//       leftCount = 1;
//     }

//     rightCount = totalPages;
//   }

//   for (var i = leftCount; i <= rightCount; i++) {
//     pagWrapper.innerHTML += `
//         <li class="page-item ${
//           i === currentPage ? "active" : ""
//         }"><button class="page-link shadow-none" onClick=paginationHandler(${i})>${i}</button></li>`;
//   }

//   /* PREV */
//   if (currentPage !== 1) {
//     pagWrapper.innerHTML =
//       `<li class="page-item"><button class="page-link shadow-none" onClick=paginationHandler(${1})>&#171; First</button></li>` +
//       pagWrapper.innerHTML;
//     // pagWrapper.innerHTML =
//     //   `<li class="page-item"><button class="page-link shadow-none" onClick=paginationHandler(${
//     //     currentPage - 1
//     //   })>&#171;</button></li>` + pagWrapper.innerHTML;
//   }

//   /* NEXT */
//   if (currentPage !== totalPages) {
//     pagWrapper.innerHTML += `<li class="page-item"><button class="page-link shadow-none" onClick=paginationHandler(${totalPages})>Last &#187;</button></li>`;
//     // pagWrapper.innerHTML += `<li class="page-item"><button class="page-link shadow-none" onClick=paginationHandler(${
//     //   currentPage + 1
//     // })>&#187;</button></li>`;
//   }
// }

/* Pagination Handler */
function paginationHandler(id) {
  currentPage = id;
  fetchPosts(stage);
}

/* SEARCH DATA */
var searchInput = document.getElementById("search-input");
var searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", searchData);

function searchData(e) {
  e.preventDefault();
  stage = 2;
  currentPage = 1;
  fetchPosts(stage);
}

/* FILTER DATA */
var filterBy = document.getElementById("filterBy");

filterBy.addEventListener("change", sortHandler);

var selectedOpt = "";
function sortHandler() {
  currentPage = 1;
  stage = 3;
  selectedOpt = this.value;
  fetchPosts(stage);
}
