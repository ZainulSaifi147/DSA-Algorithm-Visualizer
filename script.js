const container = document.querySelector(".container");
const generateBtn = document.getElementById("generate");
const showSortingBtn = document.getElementById("showSorting");
const showSearchingBtn = document.getElementById("showSearching");
const sortingPanel = document.getElementById("sortingPanel");
const searchingPanel = document.getElementById("searchingPanel");

const bubbleSortBtn = document.getElementById("bubbleSort");
const selectionSortBtn = document.getElementById("selectionSort");
const insertionSortBtn = document.getElementById("insertionSort");
const mergeSortBtn = document.getElementById("mergeSort");
const quickSortBtn = document.getElementById("quickSort");
const linearSearchBtn = document.getElementById("linearSearch");
const binarySearchBtn = document.getElementById("binarySearch");
const jumpSearchBtn = document.getElementById("jumpSearch");

const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const targetInput = document.getElementById("target");
const randomTargetBtn = document.getElementById("randomTarget");
const algoName = document.getElementById("algoName");
const algoPoints = document.getElementById("algoPoints");
const complexity = document.getElementById("complexity");
const stepText = document.getElementById("stepText");

const algorithmButtons = [
    bubbleSortBtn,
    selectionSortBtn,
    insertionSortBtn,
    mergeSortBtn,
    quickSortBtn,
    linearSearchBtn,
    binarySearchBtn,
    jumpSearchBtn
];

let speed = parseInt(speedSlider.value);
let isRunning = false;
let isPaused = false;
let shouldStop = false;

const algorithmInfo = {
    bubble: {
        name: "Bubble Sort",
        points: [
            "Compare adjacent elements",
            "Swap if left element is bigger",
            "Largest element moves to end",
            "Repeat until sorted"
        ],
        complexity: "Time Complexity: O(n^2)"
    },
    selection: {
        name: "Selection Sort",
        points: [
            "Find minimum element",
            "Swap with current index",
            "Move boundary forward",
            "Repeat until sorted"
        ],
        complexity: "Time Complexity: O(n^2)"
    },
    insertion: {
        name: "Insertion Sort",
        points: [
            "Take one element at a time",
            "Shift bigger elements",
            "Insert at correct position",
            "Repeat until sorted"
        ],
        complexity: "Time Complexity: O(n^2)"
    },
    merge: {
        name: "Merge Sort",
        points: [
            "Divide array into halves",
            "Sort each half recursively",
            "Compare smaller values",
            "Merge sorted halves"
        ],
        complexity: "Time Complexity: O(n log n)"
    },
    quick: {
        name: "Quick Sort",
        points: [
            "Choose a pivot element",
            "Move smaller values left",
            "Move larger values right",
            "Sort each partition"
        ],
        complexity: "Average Time Complexity: O(n log n)"
    },
    linear: {
        name: "Linear Search",
        points: [
            "Start from the first element",
            "Check each value one by one",
            "Stop when target is found",
            "Works on unsorted arrays"
        ],
        complexity: "Time Complexity: O(n)"
    },
    binary: {
        name: "Binary Search",
        points: [
            "Use a sorted array",
            "Check the middle value",
            "Discard half of the search range",
            "Repeat until found or empty"
        ],
        complexity: "Time Complexity: O(log n)"
    },
    jump: {
        name: "Jump Search",
        points: [
            "Use a sorted array",
            "Jump forward by block size",
            "Find the possible block",
            "Linearly search inside that block"
        ],
        complexity: "Time Complexity: O(sqrt(n))"
    }
};

speedSlider.addEventListener("input", () => {
    speed = parseInt(speedSlider.value);
    speedValue.innerText = `Speed: ${speed} ms`;
});

function setAlgorithmInfo(type){
    const info = algorithmInfo[type];

    algoName.innerText = info.name;
    algoPoints.innerHTML = info.points.map(point => `<li>${point}</li>`).join("");
    complexity.innerText = info.complexity;
}

function showPanel(type){
    const showingSorting = type === "sorting";

    sortingPanel.classList.toggle("hidden", !showingSorting);
    searchingPanel.classList.toggle("hidden", showingSorting);
    showSortingBtn.classList.toggle("active", showingSorting);
    showSearchingBtn.classList.toggle("active", !showingSorting);
}

function setRuntimeControls(){
    pauseBtn.disabled = !isRunning || isPaused;
    resumeBtn.disabled = !isRunning || !isPaused;
    stopBtn.disabled = !isRunning;
}

function setPageControlsDisabled(disabled){
    generateBtn.disabled = disabled;
    randomTargetBtn.disabled = disabled;
    targetInput.disabled = disabled;
    showSortingBtn.disabled = disabled;
    showSearchingBtn.disabled = disabled;

    algorithmButtons.forEach(button => {
        button.disabled = disabled;
    });
}

async function runAlgorithm(algorithmFunction){
    if(isRunning){
        return;
    }

    isRunning = true;
    isPaused = false;
    shouldStop = false;
    setPageControlsDisabled(true);
    setRuntimeControls();

    try{
        await algorithmFunction();
    }
    catch(error){
        if(error.message !== "STOPPED"){
            throw error;
        }

        stepText.innerText = "Algorithm stopped";
        resetBarColors();
    }
    finally{
        isRunning = false;
        isPaused = false;
        shouldStop = false;
        setPageControlsDisabled(false);
        setRuntimeControls();
    }
}

function stopIfNeeded(){
    if(shouldStop){
        throw new Error("STOPPED");
    }
}

async function waitIfPaused(){
    while(isPaused){
        stopIfNeeded();
        await delay(100, false);
    }
}

async function sleep(){
    await waitIfPaused();
    stopIfNeeded();
    await delay(speed, true);
}

function delay(ms, watchStop){
    return new Promise((resolve, reject) => {
        const started = Date.now();

        function tick(){
            if(watchStop && shouldStop){
                reject(new Error("STOPPED"));
                return;
            }

            if(Date.now() - started >= ms){
                resolve();
                return;
            }

            setTimeout(tick, 25);
        }

        tick();
    });
}

function getBars(){
    return Array.from(document.querySelectorAll(".bar"));
}

function getHeight(bar){
    return parseInt(bar.style.height);
}

function setHeight(bar, height){
    bar.style.height = `${height}px`;
}

function setBarColor(bar, color){
    bar.style.background = color;
}

function resetBarColors(){
    getBars().forEach(bar => setBarColor(bar, "cyan"));
}

function markAllSorted(){
    getBars().forEach(bar => setBarColor(bar, "lime"));
}

function getTarget(){
    return parseInt(targetInput.value);
}

function sortBarsInstantly(){
    const sortedHeights = getBars().map(getHeight).sort((a, b) => a - b);

    getBars().forEach((bar, index) => {
        setHeight(bar, sortedHeights[index]);
        setBarColor(bar, "cyan");
    });
}

function generateBars(){
    if(isRunning){
        return;
    }

    container.innerHTML = "";
    stepText.innerText = "New array generated";

    for(let i = 0; i < 30; i++){
        const value = Math.floor(Math.random() * 300) + 20;
        const bar = document.createElement("div");

        bar.classList.add("bar");
        setHeight(bar, value);
        setBarColor(bar, "cyan");
        container.appendChild(bar);
    }
}

function setRandomTarget(){
    const bars = getBars();

    if(bars.length === 0){
        return;
    }

    const randomBar = bars[Math.floor(Math.random() * bars.length)];
    targetInput.value = getHeight(randomBar);
    stepText.innerText = `Target set to ${targetInput.value}`;
}

async function bubbleSort(){
    setAlgorithmInfo("bubble");
    const bars = getBars();

    stepText.innerText = "Bubble Sort started";

    for(let i = 0; i < bars.length; i++){
        for(let j = 0; j < bars.length - i - 1; j++){
            setBarColor(bars[j], "red");
            setBarColor(bars[j + 1], "yellow");

            const height1 = getHeight(bars[j]);
            const height2 = getHeight(bars[j + 1]);

            stepText.innerText = `Comparing ${height1} and ${height2}`;
            await sleep();

            if(height1 > height2){
                stepText.innerText = `Swapping ${height1} and ${height2}`;
                setHeight(bars[j], height2);
                setHeight(bars[j + 1], height1);
                await sleep();
            }

            setBarColor(bars[j], "cyan");
            setBarColor(bars[j + 1], "cyan");
        }

        setBarColor(bars[bars.length - i - 1], "lime");
    }

    stepText.innerText = "Bubble Sort completed";
}

async function selectionSort(){
    setAlgorithmInfo("selection");
    const bars = getBars();

    stepText.innerText = "Selection Sort started";

    for(let i = 0; i < bars.length; i++){
        let minIndex = i;
        setBarColor(bars[minIndex], "red");

        for(let j = i + 1; j < bars.length; j++){
            setBarColor(bars[j], "yellow");

            const currentMin = getHeight(bars[minIndex]);
            const currentValue = getHeight(bars[j]);

            stepText.innerText = `Checking ${currentValue}`;
            await sleep();

            if(currentValue < currentMin){
                setBarColor(bars[minIndex], "cyan");
                minIndex = j;
                setBarColor(bars[minIndex], "red");
            }
            else{
                setBarColor(bars[j], "cyan");
            }
        }

        const temp = getHeight(bars[i]);
        setHeight(bars[i], getHeight(bars[minIndex]));
        setHeight(bars[minIndex], temp);

        setBarColor(bars[minIndex], "cyan");
        setBarColor(bars[i], "lime");
    }

    stepText.innerText = "Selection Sort completed";
}

async function insertionSort(){
    setAlgorithmInfo("insertion");
    const bars = getBars();

    stepText.innerText = "Insertion Sort started";

    for(let i = 1; i < bars.length; i++){
        const key = getHeight(bars[i]);
        let j = i - 1;

        setBarColor(bars[i], "red");
        stepText.innerText = `Inserting ${key}`;
        await sleep();

        while(j >= 0 && getHeight(bars[j]) > key){
            setBarColor(bars[j], "yellow");
            setHeight(bars[j + 1], getHeight(bars[j]));
            await sleep();
            setBarColor(bars[j], "cyan");
            j--;
        }

        setHeight(bars[j + 1], key);

        for(let k = 0; k <= i; k++){
            setBarColor(bars[k], "lime");
        }
    }

    stepText.innerText = "Insertion Sort completed";
}

async function mergeSort(){
    setAlgorithmInfo("merge");
    const bars = getBars();
    const values = bars.map(getHeight);

    stepText.innerText = "Merge Sort started";
    await mergeSortRange(values, bars, 0, values.length - 1);
    markAllSorted();
    stepText.innerText = "Merge Sort completed";
}

async function mergeSortRange(values, bars, left, right){
    stopIfNeeded();

    if(left >= right){
        return;
    }

    const middle = Math.floor((left + right) / 2);

    stepText.innerText = `Dividing ${left} to ${right}`;
    await sleep();

    await mergeSortRange(values, bars, left, middle);
    await mergeSortRange(values, bars, middle + 1, right);
    await merge(values, bars, left, middle, right);
}

async function merge(values, bars, left, middle, right){
    const leftArray = values.slice(left, middle + 1);
    const rightArray = values.slice(middle + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while(i < leftArray.length && j < rightArray.length){
        setBarColor(bars[k], "yellow");
        stepText.innerText = `Comparing ${leftArray[i]} and ${rightArray[j]}`;
        await sleep();

        if(leftArray[i] <= rightArray[j]){
            values[k] = leftArray[i];
            setHeight(bars[k], leftArray[i]);
            i++;
        }
        else{
            values[k] = rightArray[j];
            setHeight(bars[k], rightArray[j]);
            j++;
        }

        setBarColor(bars[k], "red");
        await sleep();
        setBarColor(bars[k], "cyan");
        k++;
    }

    while(i < leftArray.length){
        values[k] = leftArray[i];
        setHeight(bars[k], leftArray[i]);
        setBarColor(bars[k], "red");
        stepText.innerText = `Placing ${leftArray[i]}`;
        await sleep();
        setBarColor(bars[k], "cyan");
        i++;
        k++;
    }

    while(j < rightArray.length){
        values[k] = rightArray[j];
        setHeight(bars[k], rightArray[j]);
        setBarColor(bars[k], "red");
        stepText.innerText = `Placing ${rightArray[j]}`;
        await sleep();
        setBarColor(bars[k], "cyan");
        j++;
        k++;
    }
}

async function quickSort(){
    setAlgorithmInfo("quick");
    const bars = getBars();

    stepText.innerText = "Quick Sort started";
    await quickSortRange(bars, 0, bars.length - 1);
    markAllSorted();
    stepText.innerText = "Quick Sort completed";
}

async function quickSortRange(bars, low, high){
    stopIfNeeded();

    if(low < high){
        const pivotIndex = await partition(bars, low, high);
        await quickSortRange(bars, low, pivotIndex - 1);
        await quickSortRange(bars, pivotIndex + 1, high);
    }
}

async function partition(bars, low, high){
    const pivot = getHeight(bars[high]);
    let i = low - 1;

    setBarColor(bars[high], "red");
    stepText.innerText = `Pivot selected: ${pivot}`;
    await sleep();

    for(let j = low; j < high; j++){
        setBarColor(bars[j], "yellow");
        stepText.innerText = `Comparing ${getHeight(bars[j])} with pivot ${pivot}`;
        await sleep();

        if(getHeight(bars[j]) < pivot){
            i++;
            const temp = getHeight(bars[i]);
            setHeight(bars[i], getHeight(bars[j]));
            setHeight(bars[j], temp);
            await sleep();
        }

        setBarColor(bars[j], "cyan");
    }

    const temp = getHeight(bars[i + 1]);
    setHeight(bars[i + 1], getHeight(bars[high]));
    setHeight(bars[high], temp);
    setBarColor(bars[high], "cyan");
    setBarColor(bars[i + 1], "lime");
    await sleep();

    return i + 1;
}

async function linearSearch(){
    setAlgorithmInfo("linear");
    resetBarColors();

    const bars = getBars();
    const target = getTarget();

    stepText.innerText = `Linear Search started for ${target}`;

    for(let i = 0; i < bars.length; i++){
        const value = getHeight(bars[i]);

        setBarColor(bars[i], "yellow");
        stepText.innerText = `Checking ${value}`;
        await sleep();

        if(value === target){
            setBarColor(bars[i], "lime");
            stepText.innerText = `Found ${target} at index ${i}`;
            return;
        }

        setBarColor(bars[i], "red");
    }

    stepText.innerText = `${target} was not found`;
}

async function binarySearch(){
    setAlgorithmInfo("binary");
    sortBarsInstantly();

    const bars = getBars();
    const target = getTarget();
    let left = 0;
    let right = bars.length - 1;

    stepText.innerText = `Array sorted. Binary Search started for ${target}`;
    await sleep();

    while(left <= right){
        const middle = Math.floor((left + right) / 2);
        const value = getHeight(bars[middle]);

        setBarColor(bars[middle], "yellow");
        stepText.innerText = `Checking middle value ${value}`;
        await sleep();

        if(value === target){
            setBarColor(bars[middle], "lime");
            stepText.innerText = `Found ${target} at index ${middle}`;
            return;
        }

        setBarColor(bars[middle], "red");

        if(value < target){
            left = middle + 1;
            stepText.innerText = "Searching right half";
        }
        else{
            right = middle - 1;
            stepText.innerText = "Searching left half";
        }

        await sleep();
    }

    stepText.innerText = `${target} was not found`;
}

async function jumpSearch(){
    setAlgorithmInfo("jump");
    sortBarsInstantly();

    const bars = getBars();
    const target = getTarget();
    const jumpSize = Math.floor(Math.sqrt(bars.length));
    let previous = 0;
    let current = jumpSize;

    stepText.innerText = `Array sorted. Jump Search started for ${target}`;
    await sleep();

    while(previous < bars.length && getHeight(bars[Math.min(current, bars.length) - 1]) < target){
        const checkedIndex = Math.min(current, bars.length) - 1;

        setBarColor(bars[checkedIndex], "yellow");
        stepText.innerText = `Jumping to index ${checkedIndex}`;
        await sleep();
        setBarColor(bars[checkedIndex], "red");

        previous = current;
        current += jumpSize;

        if(previous >= bars.length){
            stepText.innerText = `${target} was not found`;
            return;
        }
    }

    for(let i = previous; i < Math.min(current, bars.length); i++){
        const value = getHeight(bars[i]);

        setBarColor(bars[i], "yellow");
        stepText.innerText = `Linear check ${value}`;
        await sleep();

        if(value === target){
            setBarColor(bars[i], "lime");
            stepText.innerText = `Found ${target} at index ${i}`;
            return;
        }

        setBarColor(bars[i], "red");
    }

    stepText.innerText = `${target} was not found`;
}

generateBtn.addEventListener("click", generateBars);
randomTargetBtn.addEventListener("click", setRandomTarget);
showSortingBtn.addEventListener("click", () => showPanel("sorting"));
showSearchingBtn.addEventListener("click", () => showPanel("searching"));

pauseBtn.addEventListener("click", () => {
    isPaused = true;
    stepText.innerText = "Paused";
    setRuntimeControls();
});

resumeBtn.addEventListener("click", () => {
    isPaused = false;
    stepText.innerText = "Resumed";
    setRuntimeControls();
});

stopBtn.addEventListener("click", () => {
    shouldStop = true;
    isPaused = false;
    setRuntimeControls();
});

bubbleSortBtn.addEventListener("click", () => runAlgorithm(bubbleSort));
selectionSortBtn.addEventListener("click", () => runAlgorithm(selectionSort));
insertionSortBtn.addEventListener("click", () => runAlgorithm(insertionSort));
mergeSortBtn.addEventListener("click", () => runAlgorithm(mergeSort));
quickSortBtn.addEventListener("click", () => runAlgorithm(quickSort));
linearSearchBtn.addEventListener("click", () => runAlgorithm(linearSearch));
binarySearchBtn.addEventListener("click", () => runAlgorithm(binarySearch));
jumpSearchBtn.addEventListener("click", () => runAlgorithm(jumpSearch));

setAlgorithmInfo("bubble");
generateBars();
