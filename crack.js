function getRandomInt() {
    return Math.trunc(Math.random() * 100);
}

function getRandInitPositions() {
    let alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let pos = [];
    for (let i = 0; i < 3; i++) {
        pos.push(alphabets[getRandomInt() % alphabets.length]);
    }
    return pos;
}

function getKnocksFromRotors(rots) {
    let knocks = [];
    for (let i = 0; i < rots.length; i++) {
        knocks.push(getKnockFromRotor(rots[i]));
    }
    return knocks;
}


function strReplaceAt (str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function removeCharInstance(from, has) {
    let ret = from;
    for (let i = 0; i < has.length; i++) {
        ret = ret.replace(has[i], '');
    }
    return ret;
}

function rotateStringRight(str) {
    return str[str.length - 1] + str.slice(0, str.length - 1);
}

function rotateStringRightNtimes(n, str) {
    for (let i = 0; i < n; i++) {
        str = rotateStringRight(str);
    }
    return str;
}

/* NOTE: str1 and str2 has to be the same length */
function getSimilarity(str1, str2) {
    let sims = 0;
    for (let i = 0; i<str1.length; i++)
        if (str1[i] == str2[i]) sims++;
    return sims;
}

function getStringOfPlug(obj) { // convertes a plugboard object to string
    return JSON.stringify(obj).replace('{', '').replace('}', '').replace(/\"(\w)\":\"(\w)\"/gm, '$1:$2');
}

function getPlugFromString(str) { // coverts a comma seperated key value pairs of uppercase characters into an object
    try {
        return JSON.parse(`{${str.replace(/([A-Z])\s*\:\s*([A-Z])/gm, "\"$1\":\"$2\"")}}`);
    } catch {
        return {};
    }
}

function getCycle(string) {
    let rem = "BCDEFGHIJKLMNOPQRSTUVWXYZ";
    let cycles = ['A'];
    let i = 0;
    let last = 0;
    while (rem.length > 0) {
        let cur = string[last];

        if (cycles[i].indexOf(cur) !== -1) {
            cycles.push(rem[0]);
            last = toCharI(rem[0]);
            rem = rem.slice(1);
            i++;
        } else {
            cycles[i] += cur;
            rem = rem.replace(cur, '');
            last = toCharI(cur);
        }
    }

    return cycles;
}

/* Will return a string signature of the cycle for the given ciphered text */
function getCycleSignature(unknowns) {
    let sig = ''
    for (let j = 0; j < unknowns.length; j++) {
        const unknown = unknowns[j];
        let cycles = getCycle(unknown);

        for (let i = 0; i < cycles.length; i++) cycles[i] = cycles[i].length;
        cycles.sort(function(a, b){return b-a;});

        for (let i = 0; i < cycles.length; i++) {
            if (i != 0) sig += '-';
            sig += cycles[i];
        }

        if (j != unknowns.length-1) sig += ' ';
    }
    return sig;
}

function getLast(str) {
    return str[str.length - 1];
}

/* This gives you the cycle signature associated with the given table */
function constructTableSignature(table) {

    let cycles = [[table[0][0]+table[0][3]], [table[0][1]+table[0][4]], [table[0][2]+table[0][5]]];
    // This loop automates the same patter for p4.p1 & p5.p2 & p6.p3 based on the offset from i
    let sig = '';
    for (let i = 0; i<3; i++) {
        let rem = removeCharInstance("ABCDEFGHIJKLMNOPQRSTUVWXYZ", cycles[i][0]);
        while (rem.length > 0) {
            const last = toCharI(getLast(getLast(cycles[i])));
            const cur = table[toCharI(table[last][i+0])][i+3];
            if (rem.indexOf(cur) !== -1) { // Add only if this is in the list of remaining.
                rem = rem.replace(cur, ''); // Remove this from the list of remaining.
                cycles[i][cycles[i].length-1] += cur;
            } else {
                cycles[i].push(rem[0]);
                rem = rem.slice(1);
            }
        }

        let each = cycles[i];
        for (let j = 0; j < each.length; j++) {
            cycles[i][j] = cycles[i][j].length;
        }
        cycles[i].sort(function(a, b){return b-a;});
        for (let j = 0; j < each.length; j++) {
            sig += cycles[i][j];
            if (j != each.length-1) sig += '-'
        }
        if (i != 2) sig += ' '
    }
    return sig;
}

/*
 Generate the signature of cycles for the alphabets. the key is in the form "10-10-6 23-3 13-10-2-1"
 NOTE: This only generates the cycle for rotors 1,2 & 3; The value at the key is of the form r1-r2-r3 p1-p2-p3
 where r means rotor and p means rotos position
*/
function generateCycleSignature() {
    let sigs = {};
    const rots = [
        [[M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK]],
        [[M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK]],
        [[M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK], [M3_ROTOR1, M3_ROTOR1_KNOCK]],
        [[M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR3, M3_ROTOR3_KNOCK]],
        [[M3_ROTOR3, M3_ROTOR3_KNOCK], [M3_ROTOR1, M3_ROTOR1_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK]],
        [[M3_ROTOR3, M3_ROTOR3_KNOCK], [M3_ROTOR2, M3_ROTOR2_KNOCK], [M3_ROTOR1, M3_ROTOR1_KNOCK]]
    ];

    const rot_names = ['1-2-3', '1-3-2', '2-3-1', '2-1-3', '3-1-2', '3-2-1'];

    for (let p = 0; p < 6; p++) {
        const cur_rot = rots[p];
        for (let x = 0; x < 26; x++) {
            for (let y = 0; y < 26; y++) {
                for (let z = 0; z < 26; z++) {
                    const pos1 = String.fromCharCode(65 + x);
                    const pos2 = String.fromCharCode(65 + y);
                    const pos3 = String.fromCharCode(65 + z);

                    let table = [];
                    for (let a = 0; a < 26; a++) {
                        let e = new Enigma({rotors: [cur_rot[0][0], cur_rot[1][0], cur_rot[2][0]],
                            knocks: [cur_rot[0][1], cur_rot[1][1], cur_rot[2][1]], plugs: {}, reflector: UKW_B, positions: [pos1, pos2, pos3]});
                        table.push(e.cipher(String.fromCharCode(65 + a).repeat(6)));
                    }
                    let cycle = constructTableSignature(table);
                    // let cycle = getCycleSignature(unknowns);
                    const sig = rot_names[p] + ' ' + pos1 + '-' + pos2 + '-' + pos3;
                    if (sigs[cycle] === undefined)
                        sigs[cycle] = [sig];
                    else
                        sigs[cycle].push(sig);
                }
            }
        }
        console.log("Permutation ", rot_names[p], " finished");
    }

    return sigs;
}

function checkSetting(plugs, to_match, cur_pattern) {
    if (cur_pattern.length != to_match.length) return false;

    pboard = new Plugboard(plugs);

    for (let i = 0; i < to_match.length; i++) {
        mapped = pboard.charmap.charmap[toCharI(to_match[i])];
        if (mapped != cur_pattern[i]) { // even if its undefined they wont be equal.
            //if ((getRandomInt() % 30) == 5) console.log('plugs:', plugs, 'to_match:', to_match, 'cur_pattern:', cur_pattern);
            return false;
        }
    }

    return true;
}

function getCycleFromUnknown(unknowns) {
    let cyclesToCrack = []
    for (let i = 0; i < unknowns.length; i++) {
        cyclesToCrack.push(getCycle(unknowns[i]));
    }
    return cyclesToCrack;
}

function crack(intercepted) {
    let unknowns = ['99999999999999999999999999', '99999999999999999999999999', '99999999999999999999999999']; // temps
    let possibles = [];

    for (let i = 0; i < intercepted.length; i++) {
        if (intercepted[i].length < 6) continue;
        const mesg = intercepted[i].slice(0, 6);
        unknowns[0] = strReplaceAt(unknowns[0], toCharI(mesg[0]), mesg[3]);
        unknowns[1] = strReplaceAt(unknowns[1], toCharI(mesg[1]), mesg[4]);
        unknowns[2] = strReplaceAt(unknowns[2], toCharI(mesg[2]), mesg[5]);
    }

    let cycle = getCycleSignature(unknowns);
    if (cycle in signature_db) {
        const sigs = signature_db[cycle];
        for (let j = 0; j < sigs.length; j++) {
            let rots = getRotorsFromSig(sigs[j].split(' ')[0]);
            const poss = sigs[j].split(' ')[1].split('-').join('');
            const base_pattern = generateCycleFromRot(rots, poss);
            const pattern_to_match = getCycleFromUnknown(unknowns);
            possibles.push({sig: sigs[j], rots: rots, pos: [poss[0], poss[1], poss[2]], pattern_to_match: pattern_to_match, base_pattern: base_pattern});
        }
        return possibles;
    } else {
        console.error("No signature was found for this interception :(");
        return false;
    }
}

function generateCycleFromRot(rots, pos) {
    let table = [];
    for (let a = 0; a < 26; a++) {
        let e = new Enigma({rotors: [rots[0][0], rots[1][0], rots[2][0]],
            knocks: [rots[0][1], rots[1][1], rots[2][1]], plugs: {}, reflector: UKW_B, positions: [pos[0], pos[1], pos[2]]});
        table.push(e.cipher(String.fromCharCode(65 + a).repeat(6)));
    }

    let cycles = [[table[0][0]+table[0][3]], [table[0][1]+table[0][4]], [table[0][2]+table[0][5]]];
    // This loop automates the same patter for p4.p1 & p5.p2 & p6.p3 based on the offset from i
    let sig = '';
    for (let i = 0; i<3; i++) {
        let rem = removeCharInstance("ABCDEFGHIJKLMNOPQRSTUVWXYZ", cycles[i][0]);
        while (rem.length > 0) {
            const last = toCharI(getLast(getLast(cycles[i])));
            const cur = table[toCharI(table[last][i+0])][i+3];
            if (rem.indexOf(cur) !== -1) { // Add only if this is in the list of remaining.
                rem = rem.replace(cur, ''); // Remove this from the list of remaining.
                cycles[i][cycles[i].length-1] += cur;
            } else {
                cycles[i].push(rem[0]);
                rem = rem.slice(1);
            }
        }
    }

    return cycles;
}

// var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generateCycleSignature()));

// var a = document.createElement('a');
// a.href = 'data:' + data;
// a.download = 'data.json';
// a.innerHTML = 'download JSON';

// var container = document.getElementsByTagName('body')[0];
// container.appendChild(a);
