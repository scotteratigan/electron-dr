/*
  based on documentation found here: https://web.archive.org/web/20060728052541/http://www.krakiipedia.org/wiki/SGE_protocol_saved_post
  EAccess-Protocol Documentation (amazing):
  https://github.com/WarlockFE/warlock2/wiki/EAccess-Protocol
  M:
  M       CS      CyberStrike     DR      DragonRealms    DRD     DragonRealms Development        DRF     DragonRealms The Fallen DRT     DragonRealms Prime Test  DRX     DragonRealms Platinum   GS3     GemStone IV     GS4D    GemStone IV Development GSF     GemStone IV Shattered   GST     GemStone IV Prime Test   GSX     GemStone IV Platinum
  P:
  P       CS2     1495    CS.EC   250     CS.EC   200     DR      1495    DR.EC   250     DR.P    2500    DR      1495    DR.EC   250     DR.P    2500     DRF     1995    DRF.EC  250     DR.P    2500    DRT     1495    DRT.EC  250     DRT.P   2500    DRX     1000    DRX.EC  -1      DR.P    2500     GS3     1495    GS3.EC  250     GS3.P   2500    GS3     1495    GS3.EC  250     GS3.P   2500    GSF     -1      GSF.EC  250     GS3.P   2500     GSX     1000    GSX.EC  -1      GS3.P   2500    GSX     1000    GSX.EC  -1      GS3.P   2500
  when attempting login, if account is invalid we get this:
  A               NORECORD
  if account is good but password hash is bad we get this:
  A               PASSWORD
  after too many failed login attempts? :
  A       ACCOUNTNAME  PROBLEM
  */

const SGE_URL = "eaccess.play.net";
const SGE_PORT = 7900;

function getGameKey(cb) {
  console.log('getGameKey initiated...')
  require("dotenv").config();
  if (!(process.env.ACCOUNT && process.env.PASSWORD && process.env.INSTANCE)) {
    console.error("Required environment variable not present, aborting.");
    process.exit(1);
  }
  const net = require("net");
  let connectKey = null;
  let connectIP = null;
  let connectPort = null; // todo: pass these vals instead of making global
  let hashKey = null; // hashKey vals can be 64 <= x <= 127
  const sgeClient = new net.Socket();

  sgeClient.connect(SGE_PORT, SGE_URL, res => {
    // todo: add error handling here
    console.log(`Connected to ${SGE_URL}:${SGE_PORT}`);
    setTimeout(() => {
      sgeSendStr("K\n");
    }, 5);
  });

  sgeClient.on("data", data => {
    // try {
    //   const lines = JSON.stringify([...data]);
    //   lines.forEach(line => console.log("DATA: ", line));
    // } catch (err) {
    //   console.error("Error parsing SGE line.");
    // }
    // data.split("\r\n").forEach(line => console.log(line));
    console.log("typeof data:", typeof data); // object? I think it's a buffer
    console.log("DATA:", data);
    // console.log("DATA:", data);
    if (!hashKey) {
      hashKey = [...data];
      console.log("HASH KEY:", JSON.stringify(hashKey));
      setTimeout(() => {
        console.log("Sending authentication string...");
        const hashedPassArr = hashPassword();
        console.log(`SEND: A\t${process.env.ACCOUNT}\t${hashedPassArr}\r\n`);
        sgeClient.write(`A\t${process.env.ACCOUNT}\t`);
        const buffPW = Buffer.from(hashedPassArr); // must be written as a buffer because of invalid ASCII values!
        sgeClient.write(buffPW);
        sgeClient.write("\r\n");
      }, 5);
      return;
    }
    const text = data.toString();
    if (text.startsWith("A")) {
      // A       ACCOUNT KEY     longAlphaNumericString        Subscriber Name
      if (text.includes("KEY")) {
        console.log("Authentication Successful!");
        sgeSendStr("M\n");
        return;
      } else {
        // todo: actually throw error here?
        console.error(
          "Authentication failed. Please check USERNAME and PASSWORD in .env file."
        );
        console.error("Error:", text);
        return;
      }
    }
    if (text.startsWith("M")) {
      console.log("gamesList:", text);
      sgeSendStr(`N\t${process.env.INSTANCE}\n`);
      return;
    }
    if (text.startsWith("N")) {
      console.log("game versions:", text);
      sgeSendStr(`G\t${process.env.INSTANCE}\n`);
      return;
    }
    if (text.startsWith("G")) {
      console.log("gameInfo:", text);
      sgeSendStr("C\n");
      return;
    }
    if (text.startsWith("C")) {
      accountList = text
        .trim()
        .split("\t")
        .slice(5);
      let charList = []; // not using this right now, but could be useful in the future
      let charSlotNames = {};
      for (let i = 0; i < accountList.length; i += 2) {
        charList.push({ slot: accountList[i], name: accountList[i + 1] });
        charSlotNames[accountList[i + 1]] = accountList[i];
      }
      // grabbing character name from .env file, and ensuring the case is correct:
      const desiredCharacterName = process.env.CHARACTER.toLowerCase().split(
        ""
      ); // why lower case than upper case? why split?
      desiredCharacterName[0] = desiredCharacterName[0].toUpperCase();
      const charName = desiredCharacterName.join("");
      const slotName = charSlotNames[charName];
      console.log("charSlotNames:", charSlotNames);
      console.log("slotName:", slotName);
      sgeSendStr(`L\t${slotName}\tSTORM\n`);
      return;
    }
    // Login text: L   OK      UPPORT=5535     GAME=STORM      GAMECODE=DR     FULLGAMENAME=StormFront GAMEFILE=STORMFRONT.EXE GAMEHOST=dr.simutronics.net     GAMEPORT=11324  KEY=a33f64d541ee461cab92a460e149d6d1
    if (text.startsWith("L")) {
      console.log("Login text:", text);
      connectKey = text.match(/KEY=(\S+)/)[1];
      connectIP = text.match(/GAMEHOST=(\S+)/)[1];
      connectPort = text.match(/GAMEPORT=(\d+)/)[1];
      console.log("Connect key captured as:", connectKey);
      sgeClient.destroy();
      return;
    }
    console.error("\n\n*******************************\n\n");
    console.error(" Error - unknown text received:");
    console.error(text);
    console.error("\n\n*******************************\n\n");
  });

  function hashPassword() {
    const PASS = process.env.PASSWORD;
    console.log(`Hashing password.`);
    let hashedPassword = [];
    PASS.split("").forEach((char, i) => {
      const result = hashChar(PASS[i], hashKey[i]);
      hashedPassword.push(result);
    });
    return hashedPassword; // returning as an array of ints
  }

  function hashChar(pwChar, hashNum) {
    let returnVal = hashNum ^ (pwChar.charCodeAt(0) - 32);
    returnVal += 32;
    return returnVal;
  }

  function sgeSendStr(str) {
    console.log("Sending:", str);
    sgeClient.write(str);
  }

  sgeClient.on("close", function () {
    console.log("SGE connection closed.");
    cb(connectKey, connectIP, connectPort);
  });

  sgeClient.on("error", err => {
    console.error("Error encountered:");
    console.error(err);
  });
}

module.exports = getGameKey;