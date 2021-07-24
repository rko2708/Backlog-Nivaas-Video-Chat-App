// we will create a video element and show our own video
// we will request the media that is video and audio
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
})

let myVideoStream
navigator.mediaDevices.getUserMedia({
    // what it does is it allows to get us video and audio from chrome
    video: true,
    audio: true
}).then((stream) => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream)
    })

    peer.on('call', (call) => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream)
        })
    })

    let text = $('input')

    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('')
        }
    })

    socket.on('createMessage', (message) => {
        console.log("createMessage", message)
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToBottom()
    })

})

peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id)
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

const scrollToBottom = () => {
    let d = $('.main__chat_window')
    d.scrollTop(d.prop("scrollHeight"))
}

// Mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i><span>Mute</span>`
    document.querySelector('.main__mute_button').innerHTML = html
}

const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`
    document.querySelector('.main__mute_button').innerHTML = html
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true
    }
}

const setStopVideo = () => {
    const html = `<i class="fas fa-video"></i><span>Stop Video</span>`
    document.querySelector(".main__video_button").innerHTML = html
}

const setPlayVideo = () => {
    const html = `<i class="stop fas fa-video-slash"></i><span>Play Video</span>`
    document.querySelector(".main__video_button").innerHTML = html
}




// abhishek's code



// const socket = io('/')
// const videoGrid = document.getElementById('video-grid')
// const myVideo = document.createElement('video')
// myVideo.muted = true;

// var peer = new Peer(undefined, {
//     path: '/peerjs',
//     host: '/',
//     port: '3000'
// })

// let myVideoStream

// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
// }).then(stream => {
//     myVideoStream = stream
//     addVideoStream(myVideo, stream)

//     // peer is on call
//     peer.on('call', (call) => {

//         // answering the peer's call by sending him my video stream
//         call.answer(stream)

//         // Creating a video element
//         const video = document.createElement('video')

//         // add a video stream of jisne call kiya
//         call.on('stream', (userVideoStream) => {
//             addVideoStream(video, userVideoStream)
//         })
//     })

//     //listening on my stream
//     //someone else connected -> go and Get connected to that user and send him my stream
//     socket.on('user-connected', (userId) => {
//         connectToNewUser(userId, stream)
//         console.log(userId)
//     })
// })

// peer.on('open', id => {
//     socket.emit('join-room', ROOM_ID, id)
// })


// const connectToNewUser = (userId, stream) => {
//     console.log(userId)

//     //calling this user id and sending him my stream
//     const call = peer.call(userId, stream)

//     //creating a new video element for that user 
//     const video = document.createElement('video')

//     //If we will receive some one's else video stream then I am going to add that video stream 
//     call.on('stream', (userVideoStream) => {
//         console.log(userId)
//         addVideoStream(video, userVideoStream)
//     })
// }

// const addVideoStream = (video, stream) => {
//     video.srcObject = stream
//     video.addEventListener('loadedmetadata', () => {
//         video.play()
//     })

//     videoGrid.append(video)
// }