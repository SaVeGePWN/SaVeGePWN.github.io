const API_KEY = 'AIzaSyDN9KZArEuVEMauzhYEZWg6yKibCHA9ezc';

const PROXY_URL = 'https://piped.kavin.rocks/embed/';

function searchVideos() {
    const query = document.getElementById('search-query').value;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const videoList = document.getElementById('video-list');
            videoList.innerHTML = '';

            data.items.forEach(item => {
                const videoItem = document.createElement('div');
                videoItem.classList.add('video-item');
                videoItem.onclick = () => loadVideo(item.id.videoId);

                const thumbnail = document.createElement('img');
                thumbnail.src = item.snippet.thumbnails.medium.url;
                thumbnail.classList.add('thumbnail');

                const title = document.createElement('p');
                title.innerText = item.snippet.title;
                title.classList.add('video-title');

                videoItem.appendChild(thumbnail);
                videoItem.appendChild(title);
                videoList.appendChild(videoItem);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function loadVideo(videoId) {
    const iframe = document.getElementById('video-iframe');
    iframe.src = `${PROXY_URL}${videoId}`;

    fetchVideoDetails(videoId);
    fetchComments(videoId);

    document.querySelector('.embed-container').style.display = 'block';
}

function fetchVideoDetails(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const videoDetails = document.getElementById('video-details');
            const video = data.items[0].snippet;

            videoDetails.innerHTML = `
                <h2>${video.title}</h2>
                <p>${video.description}</p>
                <p><strong>Views:</strong> ${data.items[0].statistics.viewCount}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching video details:', error);
        });
}

function fetchComments(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&maxResults=10`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const commentsSection = document.getElementById('comments');
            commentsSection.innerHTML = '';

            data.items.forEach(item => {
                const comment = document.createElement('div');
                comment.classList.add('comment');

                const author = document.createElement('p');
                author.classList.add('comment-author');
                author.innerText = item.snippet.topLevelComment.snippet.authorDisplayName;

                const text = document.createElement('p');
                text.innerText = item.snippet.topLevelComment.snippet.textDisplay;

                comment.appendChild(author);
                comment.appendChild(text);
                commentsSection.appendChild(comment);
            });
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
}
