// Establish a Socket.IO connection to the server
const socket = io();  // This will work for the client-side

// Request access to the user's media devices (e.g., camera)
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        // Once access is granted, display the local video stream
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = stream;

        // Initialize a new SimplePeer instance for peer-to-peer communication
        const peer = new SimplePeer({
            initiator: true, // Set as the initiator of the connection
            trickle: false, // Disable trickle ICE (Interactive Connectivity Establishment) for faster connection establishment
            stream: stream // Pass the local media stream to the peer
        });

        // Listen for the 'signal' event emitted by the peer
        peer.on('signal', data => {
            console.log('Signal data:', data); // Log the signal data for debugging purposes
            // Send the signal data to the server using Socket.IO
            socket.emit('signal', JSON.stringify(data));
        });

        // Listen for the 'signal' event from the server
        socket.on('signal', data => {
            console.log('Received signal:', data); // Log the received signal data for debugging purposes
            // Process the signal data received from the server and respond accordingly
            peer.signal(JSON.parse(data));
        });

        // Listen for the 'stream' event emitted by the peer when a remote stream is received
        peer.on('stream', remoteStream => {
            console.log('Received remote stream:', remoteStream); // Log the received remote stream for debugging purposes
            // Display the remote video stream in the corresponding video element
            const remoteVideo = document.getElementById('remoteVideo');
            remoteVideo.srcObject = remoteStream;
        });
    })
    .catch(error => {
        console.error('Error accessing media devices:', error); // Log any errors encountered while accessing media devices
    });
    const muteButton = document.getElementById('muteButton');
const videoButton = document.getElementById('videoButton');
const endCallButton = document.getElementById('endCallButton');

muteButton.addEventListener('click', () => {
    const mediaStream = localVideo.srcObject;
    const audioTracks = mediaStream.getAudioTracks();
    audioTracks.forEach(track => track.enabled = !track.enabled); // Toggle audio track
});

videoButton.addEventListener('click', () => {
    const mediaStream = localVideo.srcObject;
    const videoTracks = mediaStream.getVideoTracks();
    videoTracks.forEach(track => track.enabled = !track.enabled); // Toggle video track
});

endCallButton.addEventListener('click', () => {
    // Close the peer connection
    peer.destroy(); // or peer.close() based on your library
    // Optionally stop media tracks
    localVideo.srcObject.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null; // Clear video element
    remoteVideo.srcObject = null; // Clear remote video element
});
