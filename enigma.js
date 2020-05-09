const NUM_POS = 26;

function toCharI(char) {
    return char.toUpperCase().charCodeAt(0) - 65;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

class CharMap {
    constructor(charmap) {
        if (charmap === undefined) // This should be the default map aka the trivial bijection
            this.charmap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        else
            this.charmap = charmap;
        this.ptr = null; // holds mapped character
    }

    advance() {
        let temp = '';
        for (let i = 0; i < this.charmap.length; i++) {
            let newC = ((toCharI(this.charmap[i]) + 25) % 26);
            temp += String.fromCharCode(65 + newC);
        }
        temp = temp.slice(1) + temp[0];
        this.charmap = temp;
    }

    // replace(i, c) {
    //     this.charmap
    // }

    switcheroo(a, b) { // switches the characters a, b of the map.
        let bI = this.charmap.indexOf(b);
        this.charmap = this.charmap.replaceAt(this.charmap.indexOf(a), b);
        this.charmap = this.charmap.replaceAt(bI, a);
    }

    map(char) { // chainable function, `char` can be a simple character or another instance of charmap
        if (typeof char === "object" && char.constructor.name === "CharMap")
            this.ptr = this.charmap[toCharI(char.ptr)];
        else
            this.ptr = char;
        return this;
    }

    connect(char) {
        // Instead of mapping this "connects" the character to another.
        this.ptr = String.fromCharCode(65 + this.charmap.indexOf(char.ptr));
        return this;
    }
}

class Rotor {
    constructor(charmap, knocks, position) {
        this.charmap = new CharMap(charmap);
        this.knocks = [];
        for (let i = 0; i < knocks.length; i++)
            this.knocks.push(toCharI(knocks[i]));
        for (let i = 0; i < toCharI(position); i++)
            this.advance();
        this.position = toCharI(position);
    }

    advance() {
        this.position = (this.position + 1) % 26;
        this.charmap.advance();
        return (this.knocks.indexOf(this.position) != -1);
    }

    map(char) {
        this.charmap = this.charmap.map(char);
        return this.charmap;
    }

    connect(char) {
        this.charmap = this.charmap.connect(char);
        return this.charmap;
    }
}

class Plugboard {
    constructor(plugs) {
        this.charmap = new CharMap();
        for (let k in plugs)
            this.charmap.switcheroo(k, plugs[k]);
    }

    map(char) {
        return this.charmap.map(char);
    }
}

class Enigma {
    constructor(props) {
        this.rotors = [new Rotor(props.rotors[0], props.knocks[0], props.positions[0]), 
                        new Rotor(props.rotors[1], props.knocks[1], props.positions[1]),
                        new Rotor(props.rotors[2], props.knocks[2], props.positions[2])];
        this.reflector = new CharMap(props.reflector);
        this.plugs = new Plugboard(props.plugs);
        this.curmap = new CharMap();
        this.reflected = false;
    }

    // Advances based on rotor notches.
    advance() {
        if (this.rotors[2].advance())
            if (this.rotors[1].advance())
                this.rotors[0].advance();
    }

    rotor1() {
        if (this.reflected) {
            this.curmap = this.rotors[0].connect(this.curmap)
            return this;
        }
        this.curmap = this.rotors[0].map(this.curmap);
        return this;
    }

    rotor2() {
        if (this.reflected) {
            this.curmap = this.rotors[1].connect(this.curmap);
            return this;
        }
        this.curmap = this.rotors[1].map(this.curmap);
        return this;
    }

    rotor3() {
        if (this.reflected) {
            this.curmap = this.rotors[2].connect(this.curmap);
            return this;
        }
        this.curmap = this.rotors[2].map(this.curmap);
        return this;
    }

    reflect() {
        this.curmap = this.reflector.map(this.curmap);
        this.reflected = true;
        return this;
    }

    plug() {
        this.curmap = this.plugs.map(this.curmap);
        return this;
    }

    pass(char) {
        this.reflected = false;
        this.curmap = new CharMap().map(char);
        return this;
    }

    click(char) {
        char = char.toUpperCase();
        let code = char.charCodeAt(0);
        if (code < 65 || code > 90)
            return null;
        this.advance();
        this.pass(char).plug().rotor3().rotor2().rotor1().reflect().rotor1().rotor2().rotor3().plug();
        return this.curmap.ptr;
    }

    cipher(str) {
        let ret = '';
        let char;
        for (let i = 0; i < str.length; i++) {
            char = this.click(str[i]);
            if (char != null)
                ret += char;
        }
        return ret;
    }
}

/* The first iteration of plugs should be empty */
/* All arrays specified needs to be of length 3, rotors is an array of constants defined below, knocks are also an array of constants that match with rotors
   plugs needs to be a dictionary mapping each character to another (no duplicate keys or values), ground_setting and ring_setting needs to be an array of initial positions
   message is the actual message that you want to encrypt */
function encryptInEnigmaProtocol(rotors, knocks, plugs, reflector, ground_setting, ring_setting, message) {
    let out = '';
    let groundEnigma = new Enigma({rotors: rotors, knocks: knocks, plugs: plugs, reflector: reflector, positions: ground_setting});
    out += groundEnigma.cipher(ring_setting.join('').repeat(2));
    let ringEnigma = new Enigma({rotors: rotors, knocks: knocks, plugs: plugs, reflector: reflector, positions: ring_setting});
    out += ringEnigma.cipher(message);
    return out;
}

/* ring_settings and messages needs to be an array with the same length!! */
function encryptMultiInEnigmaProtocol(rotors, knocks, plugs, reflector, ground_setting, ring_settings, messages) {
    let ciphered = [];
    console.log(ring_settings.length == messages.length ? messages.length : "Bruh i told you have same length arrays");
    for (let i = 0; i < ring_settings.length; i++)
        ciphered.push(encryptInEnigmaProtocol(rotors, knocks, plugs, reflector, ground_setting, ring_settings[i], messages[i]));
    return ciphered;
}

/* messages needs to be an array of messages!! */
function decryptMultiInEnigmaProtocol(rotors, knocks, plugs, reflector, ground_setting, messages) {
    let plaintext = '';
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].length < 6) continue;
        let groundEnigma = new Enigma({rotors: rotors, knocks: knocks, plugs: plugs, reflector: reflector, positions: ground_setting});
        let ring_setting = groundEnigma.cipher(messages[i].slice(0, 6))
        plaintext += ring_setting;
        let ringEnigma = new Enigma({rotors: rotors, knocks: knocks, plugs: plugs, reflector: reflector, positions: [ring_setting[0], ring_setting[1], ring_setting[2]]});
        plaintext += ' ' + ringEnigma.cipher(messages[i].slice(6)) + '\n';
    }
    return plaintext;
}
 
// Royal Flags Wave Kings Above.
const M3_ROTOR1_KNOCK  = ["R"];
const M3_ROTOR2_KNOCK  = ["F"];
const M3_ROTOR3_KNOCK  = ["W"];
const M3_ROTOR4_KNOCK  = ["K"];
const M3_ROTOR5_KNOCK  = ["A"];
const M3_ROTOR6_KNOCKS = ["A", "N"];
const M3_ROTOR7_KNOCKS = ["A", "N"];
const M3_ROTOR8_KNOCKS = ["A", "N"];
const M3_ROTOR1 = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
const M3_ROTOR2 = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
const M3_ROTOR3 = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
const M3_ROTOR4 = "ESOVPZJAYQUIRHXLNFTGKDCMWB";
const M3_ROTOR5 = "VZBRGITYUPSDNHLXAWMJQOFECK";
const M3_ROTOR6 = "JPGVOUMFYQBENHZRDKASXLICTW";
const M3_ROTOR7 = "NZJHGRCXMYSWBOUFAIVLPEKQDT";
const M3_ROTOR8 = "FKQHTLXOCBJSPDZRAMEWNIUYGV";
const UKW_B =     "YRUHQSLDPXNGOKMIEBFZCWVJAT";
const UKW_C =     "FVPJIAOYEDRZXWGCTKUQSBNMHL";

let engima = new Enigma({rotors: [M3_ROTOR1, M3_ROTOR2, M3_ROTOR3],
    knocks: [M3_ROTOR1_KNOCK, M3_ROTOR2_KNOCK, M3_ROTOR3_KNOCK], plugs: {}, reflector: UKW_B, positions: ['A', 'A', 'A']});

const ROTORS = [M3_ROTOR1, M3_ROTOR2, M3_ROTOR3, M3_ROTOR4, M3_ROTOR5];
const ROTOR_KNOCKS = [M3_ROTOR1_KNOCK, M3_ROTOR2_KNOCK, M3_ROTOR3_KNOCK, M3_ROTOR4_KNOCK, M3_ROTOR5_KNOCK];
const REFLECTORS = [UKW_B, UKW_C];

function getRotorsFromSig(rotsig) {
    let rots = [];
    rotsig.split('-').forEach((x) => {
        switch (x) {
            case '1': rots.push([M3_ROTOR1, M3_ROTOR1_KNOCK]); break;
            case '2': rots.push([M3_ROTOR2, M3_ROTOR2_KNOCK]); break;
            case '3': rots.push([M3_ROTOR3, M3_ROTOR3_KNOCK]); break;
            case '4': rots.push([M3_ROTOR4, M3_ROTOR4_KNOCK]); break;
            case '5': rots.push([M3_ROTOR5, M3_ROTOR5_KNOCK]); break;
            default: console.error('Your signature not in proper format');
        }
    });
    return rots;
}

function getKnockFromRotor(rotor) {
    switch (rotor) {
        case M3_ROTOR1: return M3_ROTOR1_KNOCK;
        case M3_ROTOR2: return M3_ROTOR2_KNOCK;
        case M3_ROTOR3: return M3_ROTOR3_KNOCK;
        case M3_ROTOR4: return M3_ROTOR4_KNOCK;
        case M3_ROTOR5: return M3_ROTOR5_KNOCK;
        case M3_ROTOR6: return M3_ROTOR6_KNOCK;
        case M3_ROTOR7: return M3_ROTOR7_KNOCK;
        case M3_ROTOR8: return M3_ROTOR8_KNOCK;
        default:        return M3_ROTOR1_KNOCK;
    }
}

function test(characters) {
    let str = '';
    console.log("[i] Generating", characters, "random characters");
    
    for (let i = 0; i < characters; i++) {
        str += String.fromCharCode(65 + (Math.floor(Math.random() * 100) % 26));
    }
    let e1 = new Enigma({rotors: [M3_ROTOR1, M3_ROTOR2, M3_ROTOR3],
        knocks: [M3_ROTOR1_KNOCK, M3_ROTOR2_KNOCK, M3_ROTOR3_KNOCK], plugs: {'A': 'M', 'C': 'F', 'L': 'N'}, reflector: UKW_B, positions: ['Z', 'B', 'A']});
    let cipher = e1.cipher(str);
    console.log("[i] Encrypting Plaintext");
    let e2 = new Enigma({rotors: [M3_ROTOR1, M3_ROTOR2, M3_ROTOR3],
        knocks: [M3_ROTOR1_KNOCK, M3_ROTOR2_KNOCK, M3_ROTOR3_KNOCK], plugs: {'A': 'M', 'C': 'F', 'L': 'N'}, reflector: UKW_B, positions: ['Z', 'B', 'A']});
    let plain = e2.cipher(cipher);
    console.log("[i] Decrypting Ciphertext")
    if (plain == str)
        console.log("[+] Test Passed");
    else
        console.error("[-] Test Failed");
}