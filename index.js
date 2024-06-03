// document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

// function fetchPosts() {
//     fetch('https://jsonplaceholder.typicode.com/posts')
//         .then(response => response.json())
//         .then(data => {
//             const postsContainer = document.getElementById('posts-container');
//             postsContainer.innerHTML = '';
//             data.forEach(post => {
//                 const postElement = document.createElement('div');
//                 postElement.classList.add('post');
//                 postElement.innerHTML = `
//                     <h2>${post.title}</h2>
//                     <p>${post.body}</p>
//                 `;
//                 postsContainer.appendChild(postElement);
//             });
//         })
//         .catch(error => console.error('Error fetching posts:', error));
// }

// document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

// function fetchPosts() {
//     // Fetch posts and users simultaneously
//     Promise.all([
//         fetch('https://jsonplaceholder.typicode.com/posts').then(response => response.json()),
//         fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json())
//     ])
//     .then(([posts, users]) => {
//         const postsContainer = document.getElementById('posts-container');
//         postsContainer.innerHTML = '';

//         // Create a map of userId to user data for easy lookup
//         const usersMap = users.reduce((map, user) => {
//             map[user.id] = user;
//             return map;
//         }, {});

//         // Process and display each post with the user information
//         posts.forEach(post => {
//             const user = usersMap[post.userId];

//             const postElement = document.createElement('div');
//             postElement.classList.add('post');
//             postElement.innerHTML = `
//                 <h2>${post.title}</h2>
//                 <p>${post.body}</p>
//                 <p><strong>User:</strong> ${user.name} (${user.email})</p>
//             `;
//             postsContainer.appendChild(postElement);
//         });
//     })
//     .catch(error => console.error('Error fetching posts or users:', error));
// }

document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

        function fetchPosts() {
            showLoading('posts-container');
            // Fetch posts and users simultaneously
            Promise.all([
                fetch('https://jsonplaceholder.typicode.com/posts').then(response => response.json()),
                fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json())
            ])
            .then(([posts, users]) => {
                hideLoading('posts-container');
                const postsContainer = document.getElementById('posts-container');
                postsContainer.innerHTML = '';

                // Create a map of userId to user data for easy lookup
                const usersMap = users.reduce((map, user) => {
                    map[user.id] = user;
                    return map;
                }, {});

                // Process and display each post with the user information
                posts.forEach(post => {
                    const user = usersMap[post.userId];

                    const postElement = document.createElement('div');
                    postElement.classList.add('post');
                    postElement.innerHTML = `
                        <h2>${post.title}</h2>
                        <p>${post.body}</p>
                        <p><strong>User:</strong> ${user.name} (${user.email})</p>
                    `;
                    
                    // Add click event listener to each post
                    postElement.addEventListener('click', () => displayPostDetails(post, user));

                    postsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                hideLoading('posts-container');
                showError('Error fetching posts or users.', 'posts-container');
                console.error('Error fetching posts or users:', error);
            });
        }

        function displayPostDetails(post, user) {
            showLoading('post-details-container');
            // Fetch comments for the selected post
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                .then(response => response.json())
                .then(comments => {
                    hideLoading('post-details-container');
                    const postDetailsContainer = document.getElementById('post-details-container');
                    postDetailsContainer.innerHTML = `
                        <h2>${post.title}</h2>
                        <p>${post.body}</p>
                        <p><strong>User:</strong> ${user.name} (${user.email})</p>
                        <h3>Comments:</h3>
                    `;

                    // Append comments to the post details
                    comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.classList.add('comment');
                        commentElement.innerHTML = `
                            <p><strong>${comment.name} (${comment.email}):</strong> ${comment.body}</p>
                        `;
                        postDetailsContainer.appendChild(commentElement);
                    });
                })
                .catch(error => {
                    hideLoading('post-details-container');
                    showError('Error fetching comments.', 'post-details-container');
                    console.error('Error fetching comments:', error);
                });
        }

        function showLoading(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div class="loading">Loading...</div>';
        }

        function hideLoading(containerId) {
            const container = document.getElementById(containerId);
            const loadingElement = container.querySelector('.loading');
            if (loadingElement) {
                loadingElement.remove();
            }
        }

        function showError(message, containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = `<div class="error">${message}</div>`;
        }