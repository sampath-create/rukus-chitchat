const keyStrokeSounds=[
    new Audio('/sounds/keystroke1.mp3'),
    new Audio('/sounds/keystroke2.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/keystroke4.mp3'),

];
function useKeyBoardSound() {
    const playRandomStrokes = ()=>{
        const randomSound = keyStrokeSounds[Math.floor(Math.random()*keyStrokeSounds.length)];
        randomSound.play();
    };
    return {playRandomStrokes};
}

export default useKeyBoardSound;