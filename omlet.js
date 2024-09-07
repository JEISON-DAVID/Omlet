const startRandomCallButton = document.getElementById('startRandomCall');
const startIdCallButton = document.getElementById('startIdCall');
const videoContainer = document.getElementById('videoContainer');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const toggleCameraButton = document.getElementById('toggleCamera');
const toggleMicButton = document.getElementById('toggleMic');
const endCallButton = document.getElementById('endCall');
const peerIdContainer = document.getElementById('peerIdContainer');
const peerIdElement = document.getElementById('peerId');
const copyIdButton = document.getElementById('copyIdButton');

let localStream;
let peer;
let call;
let cameraOn = true;
let micOn = true;

function generatePeerId() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

async function getLocalStream() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
}

startRandomCallButton.addEventListener('click', async () => {
    await getLocalStream();
    startRandomCall();
});

startIdCallButton.addEventListener('click', async () => {
    await getLocalStream();
    const remotePeerId = prompt('Ingresa el ID del otro usuario:');
    startIdCall(remotePeerId);
});

function startRandomCall() {
    peer = new Peer(generatePeerId());

    peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        peerIdElement.textContent = id;
        peerIdContainer.classList.remove('hidden');
    });

    peer.on('call', (incomingCall) => {
        call = incomingCall;
        call.answer(localStream);
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });
    });

    setTimeout(() => {
        const remotePeerId = prompt('Ingresa el ID del otro usuario:');
        call = peer.call(remotePeerId, localStream);
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });
    }, 2000);
}

function startIdCall(remotePeerId) {
    peer = new Peer(generatePeerId());

    peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        peerIdElement.textContent = id;
        peerIdContainer.classList.remove('hidden');
    });

    call = peer.call(remotePeerId, localStream);
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });
}

toggleCameraButton.addEventListener('click', () => {
    cameraOn = !cameraOn;
    localStream.getVideoTracks()[0].enabled = cameraOn;
    toggleCameraButton.textContent = cameraOn ? 'Apagar Cámara' : 'Encender Cámara';
});

toggleMicButton.addEventListener('click', () => {
    micOn = !micOn;
    localStream.getAudioTracks()[0].enabled = micOn;
    toggleMicButton.textContent = micOn ? 'Apagar Micrófono' : 'Encender Micrófono';
});

endCallButton.addEventListener('click', () => {
    if (call) {
        call.close();
        videoContainer.classList.add('hidden');
        peerIdContainer.classList.add('hidden');
    }
});

copyIdButton.addEventListener('click', () => {
    navigator.clipboard.writeText(peerIdElement.textContent).then(() => {
        alert('ID copiado al portapapeles');
    });
});
  