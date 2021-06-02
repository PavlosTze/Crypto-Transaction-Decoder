(function() {
    let DOM = {};
    DOM.network = $(".network");
    DOM.transactionHexText = $(".transaction-hex-text");
    DOM.decodedTx = $(".decoded-tx");
    DOM.decode = $(".decoding-button");

	let network = bitcoinjs.bitcoin.networks.bitcoin;

  function init() {
	  // Events
		DOM.network.on("change", networkChanged);
	  DOM.decode.on("click", startDecoding);
	  populateNetworkSelect();
  }

  function populateNetworkSelect() {
    for (let i = 0; i < networks.length; i++) {
      let network = networks[i];
      let option = $("<option>");
      option.attr("value", i);
      option.text(network.name);
      if (network.name == "BTC - Bitcoin") {
        option.prop("selected", true);
      }
      DOM.network.append(option);
    }
  }

	function networkChanged(e) {
		var networkIndex = e.target.value;
		var network = networks[networkIndex];
		network.onSelect();
		DOM.decodedTx[0].textContent = null;
	}

	function networkIsEthereumFamily() {
		let name = networks[DOM.network.val()].name;
		return (name == "ETH - Ethereum")
					|| (name == "ETC - Ethereum Classic")
					|| (name == "POA - Poa")
					|| (name == "PIRL - Pirl")
					|| (name == "MIX - MIX")
					|| (name == "EXP - Expanse")
					|| (name == "MUSIC - Musicoin")
					|| (name == "CLO - Callisto")
	}

	function networkHasExtraTxTimeField() {
		let name = networks[DOM.network.val()].name;
		return (name == "PPC - Peercoin")
					|| (name == "NRO - Neuro")
					|| (name == "RBY - Rubycoin")
					|| (name == "NVC - Novacoin")
					|| (name == "STRAT - Stratis")
					|| (name == "WC - Wincoin")
					|| (name == "XVG - Verge")
					|| (name == "XVC - Vcash")
					|| (name == "KOBO - Kobocoin")
					|| (name == "PUT - Putincoin")
					|| (name == "INSN - Insanecoin")
					|| (name == "TOA - Toacoin")
					|| (name == "PINK - Pinkcoin")
					|| (name == "GCR - GCRCoin")
					|| (name == "EXCL - ExclusiveCoin")
					|| (name == "D - Denarius")
					|| (name == "OK - OKCash")
					|| (name == "CLUB - Clubcoin")
					|| (name == "BRIT - Britcoin")
					|| (name == "BLK - Blackcoin")
					|| (name == "XBC - Bitcoin Plus")
					|| (name == "XWC - Whitecoin")
					|| (name == "RDD - Reddcoin")
					|| (name == "POT - Potcoin")
					|| (name == "GRC - Gridcoin")
					|| (name == "NAV - Navcoin")
					|| (name == "SLR - Solarcoin")
					|| (name == "VASH - Vpncoin")
					|| (name == "CLAM - Clams")
					|| (name == "CCN - Cannacoin")
	}

	function networkHasExtraBytesField() {
		let name = networks[DOM.network.val()].name;
		return (name == "GRC - Gridcoin")
					|| (name == "NAV - Navcoin")
					|| (name == "SLR - Solarcoin")
					|| (name == "VASH - Vpncoin")
					|| (name == "CLAM - Clams")
	}

	function networkIsZcashFamily() {
		let name = networks[DOM.network.val()].name;
		return (name == "ZEC - Zcash")
					|| (name == "ZCL - Zclassic")
					|| (name == "BTCZ - BitcoinZ")
					|| (name == "KMD - Komodo")
					|| (name == "BTCP - Bitcoin Private")
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString('hex')
	  return n.toString('hex')
	}

	function decredDecodedTxToJSON(decredDecodedTx) {
		let insJsonArray = [];
		let outsJsonArray = [];
		var decredjsUtil = require("decredjs-lib");

		// Parse inputs
		for(let input of decredDecodedTx.ins) {
			let hash = toHex(input.hash);
			let index = input.index;
			let sequence = input.sequence;

			let inputToJSON = {
				"prev_hash": hash,
				"index": index,
				"sequence": sequence,
			}

			if(input.witness.length > 0) {
				inputToJSON["witness"] = toHex(input.witness)
			}

			insJsonArray.push(inputToJSON);
		}

		// Parse outputs
		for(let output of decredDecodedTx.outs) {
			let decredScriptObject = decredjsUtil.Script.fromBuffer(output.script);
			let decredAddressObject = decredjsUtil.Address.fromScript(decredScriptObject, "livenet")

			let value = output.value;
			let script = toHex(output.script);
			let script_version = toHex(output.script_version);
			let type = decredAddressObject.type;
			let address = new decredjsUtil.Address(decredAddressObject.hashBuffer, "livenet", decredAddressObject.type).toString();

			let outputToJSON = {
				"value": value,
				"address": address,
				"script": script,
				"script_type": type,
				"script_version": script_version,
			}

			outsJsonArray.push(outputToJSON);
		}


		let txInJSON = {
			"version": decredDecodedTx.version,
			"locktime": decredDecodedTx.locktime,
			"expiry": decredDecodedTx.expiry,
			"inputs": insJsonArray,
			"outputs": outsJsonArray,
		};

		return txInJSON;
	}

	function utxoDecodedTxToJSON(utxoDecodedTx) {
		let insJsonArray = [];
		let outsJsonArray = [];

		// Parse inputs
		for(let input of utxoDecodedTx.ins) {
			let hash = toHex(input.hash.reverse());
			let index = input.index;
			let script = toHex(input.script);

			let type = bitcoinjs.bitcoin.script.classifyInput(input.script);
			if(script == 0 && type == 'nonstandard') {
				type = bitcoinjs.bitcoin.script.classifyWitness(input.witness);
			}

			let sequence = input.sequence;

			let witnesses = []
			for(let witness of input.witness) {
				witnesses.push(toHex(witness));
			}

			let inputToJSON = {
				"prev_hash": hash,
				"index": index,
				"sequence": sequence,
				"witness": witnesses,
				"script_type": type,
			}

			if(script != 0) {
				inputToJSON["script"] = script
			}

			insJsonArray.push(inputToJSON);
		}

		// Parse outputs
		for(let output of utxoDecodedTx.outs) {
			let value = output.value;
			let type = bitcoinjs.bitcoin.script.classifyOutput(output.script);
			let script = toHex(output.script);
			let address;

			try {
				address = bitcoinjs.bitcoin.address.fromOutputScript(output.script, network);

				// Some coins have different address format
				if (networks[DOM.network.val()].name == "GRS - Groestlcoin") {
					address = groestlcoinjs.address.fromOutputScript(output.script, network);
				} else if(networks[DOM.network.val()].name == "BCH - Bitcoin Cash") {
					address = bchaddr.toCashAddress(address);
				} else if(networks[DOM.network.val()].name == "SMART - Smartcash") {
					address = smartcashjs.address.fromOutputScript(output.script, network);
				}
			} catch(e) {
				console.log(e)
				address = "";
			}

			let outputToJSON = {
				"value": value,
				"address": address,
				"script": script,
				"script_type": type,
			}

			outsJsonArray.push(outputToJSON);
		}


		let txInJSON = {
			"version": utxoDecodedTx.version,
			"locktime": utxoDecodedTx.locktime,
			"inputs": insJsonArray,
			"outputs": outsJsonArray,
		};

		return txInJSON;
	}

	function addExtraZcashFamilyFields(decodedTx, decodedTxInJSON) {
		decodedTxInJSON["expiryHeight"] = decodedTx.expiryHeight;
		decodedTxInJSON["overwintered"] = decodedTx.overwintered === 1 ? true : false;
		decodedTxInJSON["versionGroupId"] = decodedTx.versionGroupId.toString(16);

		return decodedTxInJSON
	}

	function ethDecodedTxToJSON(ethDecodedTx) {
    let nonce = parseInt(ethUtil.baToJSON(ethDecodedTx[0]));
    let gasPrice = parseInt(ethUtil.baToJSON(ethDecodedTx[1]));
    let gasLimit = parseInt(ethUtil.baToJSON(ethDecodedTx[2]));
    let to = ethUtil.baToJSON(ethDecodedTx[3]);
    let valueInWei = parseInt(ethUtil.baToJSON(ethDecodedTx[4]));
    let valueFormatted = parseInt(ethUtil.baToJSON(ethDecodedTx[4]))/Math.pow(10,18);
    let inputData = ethUtil.baToJSON(ethDecodedTx[5]);
    let v = ethUtil.baToJSON(ethDecodedTx[6]);
    let r = ethUtil.baToJSON(ethDecodedTx[7]);
    let s = ethUtil.baToJSON(ethDecodedTx[8]);

		let txInJSON = {
			"nonce": nonce,
			"gasPrice": gasPrice,
			"gasLimit": gasLimit,
			"to": to,
			"valueInWei": valueInWei,
			"value": valueFormatted,
			"inputData": inputData,
			"v": v,
			"r": r,
			"s": s,
		};

		return txInJSON;
	}

	function aionDecodedTxToJSON(aionDecodedTx) {
    let nonce = parseInt(ethUtil.baToJSON(aionDecodedTx[0]));
    let to = ethUtil.baToJSON(aionDecodedTx[1]);
    let value = parseInt(ethUtil.baToJSON(aionDecodedTx[2]));
		let valueInAion = parseInt(ethUtil.baToJSON(aionDecodedTx[2]))/Math.pow(10,18);
    let inputData = ethUtil.baToJSON(aionDecodedTx[3]);
    let timestamp = parseInt(ethUtil.baToJSON(aionDecodedTx[4]));
    let gasLimit = parseInt(ethUtil.baToJSON(aionDecodedTx[5]));
    let gasPrice = parseInt(ethUtil.baToJSON(aionDecodedTx[6]));
    let type = parseInt(ethUtil.baToJSON(aionDecodedTx[7]));
    let signature = ethUtil.baToJSON(aionDecodedTx[8]);

		let txInJSON = {
			"nonce": nonce,
			"to": to,
			"value": value,
			"valueInAion": valueInAion,
			"gasLimit": gasLimit,
			"gasPrice": gasPrice,
			"type": type,
			"inputData": inputData,
			"timestamp": timestamp,
			"signature": signature,
		};

		return txInJSON;
	}

	function bnbDecodedTxToJSON(bnbDecodedTx) {
		bnbDecodedTx.signatures.map(signature => {
			signature.pub_key = toHex(signature.pub_key)
			signature.signature = toHex(signature.signature)
		});

		return bnbDecodedTx;
	}

	function nemDecodedTxToJSON(nemDecodedTx) {
		nemDecodedTx.signer = toHex(nemDecodedTx.signer)
		nemDecodedTx.receiver =  nemDecodedTx.receiver.toString()
		nemDecodedTx.amountInXem = nemDecodedTx.amount/Math.pow(10,6)

		if(nemDecodedTx.signature) {
			nemDecodedTx.signature = toHex(nemDecodedTx.signature)
		}

		if(nemDecodedTx.message) {
			nemDecodedTx.message = nemDecodedTx.message.toString()
		}

		return nemDecodedTx;
	}

	function arkDecodedTxToJSON(arkDecodedTx) {
		let txInJSON = {
			"version": arkDecodedTx.version,
			"network": arkDecodedTx.network,
			"type": arkDecodedTx.type,
			"timestamp": arkDecodedTx.timestamp,
			"senderPublicKey": toHex(arkDecodedTx.senderPublicKey),
			"receiver": arkDecodedTx.receiver,
			"fee": arkDecodedTx.fee,
			"amount": arkDecodedTx.amount,
			"expiration": arkDecodedTx.expiration,
			"signature": toHex(arkDecodedTx.signature),
		};

		if(arkDecodedTx.vendor) {
			txInJSON["vendor"] = arkDecodedTx.vendor
		}

		return txInJSON;
	}

	function algoDecodedTxToJSON(algoDecodedTx) {
		let txInJSON = {}

		//Unsigned Tx
		if(!algoDecodedTx.txn) {
			txInJSON = algoDecodedTx
			txInJSON.genesishashb64 = toHex(txInJSON.genesishashb64)
		}
		// Signed Tx
		else if(algoDecodedTx.txn) {

			// We create the txInJSON from the start to name the keys better so the user recognizes what is what
			txInJSON = {
				"sig": toHex(algoDecodedTx.sig),
				"amount": algoDecodedTx.txn.amt,
				"fee": algoDecodedTx.txn.fee,
				"fv": algoDecodedTx.txn.fv,
				"genesisID": algoDecodedTx.txn.gen,
				"genesisHash": toHex(algoDecodedTx.txn.gh),
				"lv": algoDecodedTx.txn.lv,
				"receiver": algoDecodedTx.txn.rcv,
				"sender": algoDecodedTx.txn.snd,
				"type": algoDecodedTx.txn.type,
			};
		}

		return txInJSON;
	}

	function moneroDecodedTxToJSON(xmrDecodedTx) {
		let txInJSON = {}
		let extrasJsonArray = []

		txInJSON["version"] = xmrDecodedTx.version
		txInJSON["unlockTime"] = xmrDecodedTx.unlockTime

		xmrDecodedTx.ins.map(input => {
			if(input.type === "TxInToKey") {
				input.k_image = toHex(input.k_image)
			}
		});

		xmrDecodedTx.outs.map(out => {
			out.key = toHex(out.key)
		});

		for(let extra of xmrDecodedTx.extras) {
			let extraToJSON = {}

			extraToJSON["type"] = extra.type

			if(extra.type === "TxExtraNonce") {
				extraToJSON["nonce"] = toHex(extra.nonce)
			} else if(extra.type === "TxExtraPubKey") {
				extraToJSON["pub_key"] = toHex(extra.pub_key)
			} else if(extra.type === "TxExtraPadding") {
				extraToJSON["size"] = extra.size
			} else if(extra.type === "TxExtraAdditionalPubKeys") {
				let extraPubKeys = []
				for(let pub_key of extra.pub_keys) {
					extraPubKeys.push(toHex(pub_key))
				}
				extraToJSON["pub_keys"] = extraPubKeys
			} else if(extra.type === "TxExtraMergeMining") {
				extraToJSON["depth"] = extra.depth
				extraToJSON["merkle_root"] = toHex(extra.merkle_root)
			} else if(extra.TxExtraMinergate === "TxExtraMinergate") {
				extraToJSON["data"] = toHex(extra.data)
			} else if(extra.TxExtraMinergate === "TxExtraUnknown") {
				extraToJSON["data"] = toHex(extra.data)
			}

			extrasJsonArray.push(extraToJSON);
		}

		if(xmrDecodedTx.version === 1) {
			xmrDecodedTx.signatures.map(signature => {
				signature.c = toHex(signature.c)
				signature.r = toHex(signature.r)
			});
		} else {
			if(xmrDecodedTx.rctSig.pseudoOuts) {
				xmrDecodedTx.rctSig.pseudoOuts.m.map(m => {
					m = toHex(m)
				});
			}

			xmrDecodedTx.rctSig.ecdhInfo.map(ecdhInfo => {
				ecdhInfo.mask = toHex(ecdhInfo.mask)
				ecdhInfo.amount = toHex(ecdhInfo.amount)
			});

			for(let i = 0; i < xmrDecodedTx.rctSig.outPk.m.length; i++) {
				xmrDecodedTx.rctSig.outPk.m[i] = toHex(xmrDecodedTx.rctSig.outPk.m[i])
			}

			// Prunable
			if(xmrDecodedTx.rctSig.p) {

				// Bulletproofs
				xmrDecodedTx.rctSig.p.bulletproofs.map(bp => {
					bp.A = toHex(bp.A);
					bp.S = toHex(bp.S);
					bp.T1 = toHex(bp.T1);
					bp.T2 = toHex(bp.T2);
					bp.taux = toHex(bp.taux);
					bp.mu = toHex(bp.mu);
					for(let i = 0; i < bp.L.m.length; i++) {
						bp.L.m[i] = toHex(bp.L.m[i])
					}
					for(let i = 0; i < bp.R.m.length; i++) {
						bp.R.m[i] = toHex(bp.R.m[i])
					}
					bp.a = toHex(bp.a);
					bp.b = toHex(bp.b);
					bp.t = toHex(bp.t);
				});

				//MGs
				for(let mg of xmrDecodedTx.rctSig.p.MGs) {
					for(let ss of mg.ss.m) {
						for(let i = 0; i < ss.length; i++) {
							ss[i] = toHex(ss[i])
						}
					}
					mg.cc = toHex(mg.cc);
				}


				// Pseudo outputs
				if(xmrDecodedTx.rctSig.p.pseudoOuts) {
					for(let i = 0; i < xmrDecodedTx.rctSig.p.pseudoOuts.m.length; i++) {
						xmrDecodedTx.rctSig.p.pseudoOuts.m[i] = toHex(xmrDecodedTx.rctSig.p.pseudoOuts.m[i])
					}
				}
			}
		}

		txInJSON["inputs"] = xmrDecodedTx.ins
		txInJSON["outputs"] = xmrDecodedTx.outs
		txInJSON["extras"] = extrasJsonArray
		if(xmrDecodedTx.version === 1) {
			txInJSON["signatures"] = xmrDecodedTx.signatures
		} else {
			txInJSON["rctSig"] = xmrDecodedTx.rctSig
		}

		return txInJSON
	}

	/*  TODO:
		Review zcashjs.
		Added BitGo library - https://github.com/BitGo/bitgo-utxo-lib - (bitcoinjs fork) that contains more coins than Zcash.
		I added a lot more coins in that library as well (find them all in the networks list)
		Maybe remove the bitcoinjs library and use the above only
	*/
	/*
	TODO: Fix CROWN (CRW) empty string as address
	*/
  function startDecoding() {
		let txRawHex = DOM.transactionHexText[0].value;

		let decodedTx;
		let decodedTxInJSON;
		let isBitcoinFamilyNetwork = true;
		let selectedNetworkName = networks[DOM.network.val()].name

		try {
			if(networkIsEthereumFamily() || selectedNetworkName == "AION - Aion") {
				isBitcoinFamilyNetwork = false

				// TODO:  If we add the 0x prefix to the raw bytes in core then remove the line below
				txRawHex = "0x" + txRawHex
				decodedTx = ethUtil.rlp.decode(txRawHex);

				if(networkIsEthereumFamily()) {
					decodedTxInJSON = ethDecodedTxToJSON(decodedTx);
				} else {
					decodedTxInJSON = aionDecodedTxToJSON(decodedTx);
				}
			}

			if (selectedNetworkName == "XMR - Monero") {
				isBitcoinFamilyNetwork = false
				decodedTx = moneroTransactionDecoder.fromHex(txRawHex);
				decodedTxInJSON = moneroDecodedTxToJSON(decodedTx);
			}

			if(selectedNetworkName == "XEM - NEM") {
				isBitcoinFamilyNetwork = false
				decodedTx = nemTransactionDecoder.fromHex(txRawHex)
				decodedTxInJSON = nemDecodedTxToJSON(decodedTx);
			}

			if(selectedNetworkName == "HYD - Hydra Token" || selectedNetworkName == "ARK - ARK") {
				isBitcoinFamilyNetwork = false
				decodedTx = arkTransactionDecoder.fromHex(txRawHex)
				decodedTxInJSON = arkDecodedTxToJSON(decodedTx);
			}

			if (selectedNetworkName == "XRP - Ripple") {
				isBitcoinFamilyNetwork = false

				// That's a prefix flag for single signing, we do not want to parse it
				if(txRawHex.startsWith("53545800")) {
					txRawHex = txRawHex.slice(8)
				}

		    decodedTx = rippleDecoder.decode(txRawHex.toUpperCase());

				// We do not need to format any values
				decodedTxInJSON = decodedTx
			}

			if (selectedNetworkName == "BNB - Binance") {
				isBitcoinFamilyNetwork = false
		    decodedTx = bnbDecoder.decodeTransfer(txRawHex);
				decodedTxInJSON = bnbDecodedTxToJSON(decodedTx);
			}

			if (selectedNetworkName == "ALGO - Algorand") {
				isBitcoinFamilyNetwork = false
				decodedTx = algoTransactionDecoder.fromHex(txRawHex)
				decodedTxInJSON = algoDecodedTxToJSON(decodedTx);
			}

			if (selectedNetworkName == "TRON - Tron") {
				isBitcoinFamilyNetwork = false
				decodedTx = tronTransactionDecoder.fromHex(txRawHex)

				// We do not need to format any values
				decodedTxInJSON = decodedTx
			}

			// All coins that use utxofamilyjs library
			if (networkIsZcashFamily() || networkHasExtraTxTimeField() || selectedNetworkName == "DCR - Decred"
			|| selectedNetworkName == "USNBT - NuBits" || selectedNetworkName == "NSR - NuShares") {

				isBitcoinFamilyNetwork = false
				decodedTx = utxofamilyjs.Transaction.fromHex(txRawHex, network);

				if(networkIsZcashFamily()) {
					decodedTxInJSON = utxoDecodedTxToJSON(decodedTx);
					decodedTxInJSON = addExtraZcashFamilyFields(decodedTx, decodedTxInJSON);
				}

				if (networkHasExtraTxTimeField()) {
					decodedTxInJSON = utxoDecodedTxToJSON(decodedTx);
					decodedTxInJSON["txTime"] = decodedTx.extraTxTime

					if (networkHasExtraBytesField()) {
						if(decodedTx.extraBytesLength > 0) {
							let extraBytesAsString = ''
							for(let extraByte of decodedTx.extraBytes) {
								extraBytesAsString += String.fromCharCode(extraByte.byte)
							}
							decodedTxInJSON["extraBytes"] = extraBytesAsString
						}
					}
				}

				if(selectedNetworkName == "DCR - Decred") {
					decodedTxInJSON = decredDecodedTxToJSON(decodedTx);
				}

				if (selectedNetworkName == "USNBT - NuBits" || selectedNetworkName == "NSR - NuShares") {
					decodedTxInJSON = utxoDecodedTxToJSON(decodedTx);
					decodedTxInJSON["txTime"] = decodedTx.extraTxTime
					decodedTxInJSON["txTokenId"] = decodedTx.txTokenId
				}
			}

			if (isBitcoinFamilyNetwork) {
				decodedTx = bitcoinjs.bitcoin.Transaction.fromHex(txRawHex);
				decodedTxInJSON = utxoDecodedTxToJSON(decodedTx);
			}
		} catch(err) {
			console.log(err)
			decodedTxInJSON = {
				"Error": "Couldn't decode hex: " + txRawHex,
			};
		}

		DOM.decodedTx[0].textContent = JSON.stringify(decodedTxInJSON, undefined, 2);
  }

  let networks = [
	{
		name: "ACC - Adcoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.adcoin;
		},
	},
	{
		name: "AION - Aion",
		onSelect: function() {
			network = null;
		},
	},
	{
		name: "ALGO - Algorand",
		onSelect: function() {
			network = null;
		},
	},
	{
		name: "ARK - ARK",
		onSelect: function() {
			network = null;
		},
	},
	{
		name: "ARYA - Aryacoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.aryacoin;
		},
	},
	{
		name: "AUR - Auroracoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.auroracoin;
		},
	},
	{
		name: "BTA - Bata",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.bata;
		},
	},
	{
		name: "BCA - Bitcoin Atom",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.bitcoinatom;
		},
	},
	{
		name: "BCH - Bitcoin Cash",
    onSelect: function() {
      network = bitcoinjs.bitcoin.networks.bitcoin;
    },
	},
	{
		name: "BLK - Blackcoin",
		onSelect: function() {
      network = utxofamilyjs.networks.blackcoin;
		},
	},
	{
		name: "BNB - Binance",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "BRIT - Britcoin",
		onSelect: function() {
      network = utxofamilyjs.networks.britcoin;
		},
	},
	{
		name: "BSD - Bitsend",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.bitsend;
		},
	},
	{
		name: "BSV - Bitcoin SV",
    onSelect: function() {
      network = bitcoinjs.bitcoin.networks.bitcoin;
    },
	},
	{
		name: "BTC - Bitcoin",
    onSelect: function() {
      network = bitcoinjs.bitcoin.networks.bitcoin;
    },
	},
	{
		name: "BTCP - Bitcoin Private",
		onSelect: function() {
			network = utxofamilyjs.networks.bitcoinprivate;
		},
	},
	{
		name: "BTCZ - BitcoinZ",
		onSelect: function() {
			network = utxofamilyjs.networks.zcash;
		},
	},
	{
		name: "BTG - Bitcoin Gold",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.bitcoingold;
		},
	},
	{
		name: "BTX - Bitcore",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.bitcore;
		},
	},
	{
		name: "CCN - Cannacoin",
		onSelect: function() {
      network = utxofamilyjs.networks.cannacoin;
		},
	},
	{
		name: "CDN - Canadaecoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.canadaecoin;
		},
	},
	{
		name: "CLAM - Clams",
		onSelect: function() {
      network = utxofamilyjs.networks.clams;
		},
	},
	{
		name: "CLO - Callisto",
		onSelect: function() {
      network = null;
		},
	},
	{
		name: "CLUB - Clubcoin",
		onSelect: function() {
      network = utxofamilyjs.networks.clubcoin;
		},
	},
	{
		name: "CRAVE - Crave",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.crave;
		},
	},
	{
		name: "CRW - Crown",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.crown;
		},
	},
	{
		name: "D - Denarius",
		onSelect: function() {
			network = utxofamilyjs.networks.denarius;
		},
	},
	{
		name: "DASH - Dash",
    onSelect: function() {
      network = bitcoinjs.bitcoin.networks.dash;
    },
	},
	{
		name: "DCR - Decred",
		onSelect: function() {
			network = utxofamilyjs.networks.decred;
		},
	},
	{
		name: "DEFC - Defcoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.defcoin;
		},
	},
	{
		name: "DGB - Digibyte",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.digibyte;
		},
	},
  {
    name: "DGC - Digitalcoin",
    onSelect: function() {
      network = bitcoinjs.bitcoin.networks.digitalcoin;
    },
  },
	{
		name: "DMD - Diamond",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.diamond;
		},
	},
	{
		name: "DOGE - Dogecoin",
    onSelect: function() {
      network = bitcoinjs.bitcoin.networks.dogecoin;
    },
	},
	{
		name: "DONU - Donu",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.donu;
		},
	},
	{
		name: "EFL - Egulden",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.egulden;
		},
	},
	{
		name: "EMC2 - Einsteinium",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.einsteinium;
		},
	},
	{
		name: "ERC - Europecoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.europecoin;
		},
	},
	{
		name: "ETC - Ethereum Classic",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "ETH - Ethereum",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "EXCL - ExclusiveCoin",
    onSelect: function() {
      network = utxofamilyjs.networks.exclusivecoin;
    },
	},
	{
		name: "EXP - Expanse",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "FJC - Fujicoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.fujicoin;
		},
	},
	{
		name: "FLASH - Flashcoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.flashcoin;
		},
	},
	{
		name: "FTC - Feathercoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.feathercoin;
		},
	},
	{
		name: "GAME - GameCredits",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.game;
		},
	},
	{
		name: "GBX - Gobyte",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.gobyte;
		},
	},
	{
		name: "GCR- GCRCoin",
		onSelect: function() {
      network = utxofamilyjs.networks.gcrcoin;
		},
	},
	{
		name: "GRC - Gridcoin",
		onSelect: function() {
			network = utxofamilyjs.networks.gridcoin;
		},
	},
	{
		name: "GRS - Groestlcoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.groestlcoin;
		},
	},
	{
		name: "HYD - Hydra Token",
		onSelect: function() {
      network = null;
		},
	},
	{
		name: "INSN - Insanecoin",
		onSelect: function() {
      network = utxofamilyjs.networks.insanecoin;
		},
	},
	{
		name: "IOP - Iop",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.iop;
		},
	},
	{
		name: "IXC - Ixcoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.ixcoin;
		},
	},
	{
		name: "KMD - Komodo",
		onSelect: function() {
			network = utxofamilyjs.networks.komodo;
		},
	},
	{
		name: "KOBO - Kobocoin",
		onSelect: function() {
      network = utxofamilyjs.networks.kobocoin;
		},
	},
	{
		name: "LBC - Library Credits",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.lbry;
		},
	},
	{
		name: "LCC - Litecoincash",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.litecoincash;
		},
	},
	{
		name: "LINX - Linx",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.linx;
		},
	},
	{
		name: "LTC - Litecoin",
    onSelect: function() {
      network = bitcoinjs.bitcoin.networks.litecoin;
    },
	},
	{
		name: "LYNX - Lynx",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.lynx;
		},
	},
	{
		name: "MIX - MIX",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "MNX - Minexcoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.minexcoin;
		},
	},
  {
    name: "MONA - Monacoin",
    onSelect: function() {
      network = bitcoinjs.bitcoin.networks.monacoin;
    },
	},
	{
		name: "MONK - Monkey Project",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.monkeyproject;
		},
	},
	{
		name: "MUSIC - Musicoin",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "NAV - Navcoin",
		onSelect: function() {
			network = utxofamilyjs.networks.navcoin;
		},
	},
	{
		name: "NEOS - Neoscoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.neoscoin;
		},
	},
	{
		name: "NMC - Namecoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.namecoin;
		},
	},
	{
		name: "NVC - Novacoin",
		onSelect: function() {
			network = utxofamilyjs.networks.novacoin;
		},
	},
	{
		name: "NRO - Neuro",
		onSelect: function() {
			network = utxofamilyjs.networks.neuro;
		},
	},
	{
		name: "NSR - NuShares",
    onSelect: function() {
      network = utxofamilyjs.networks.nushares;
    },
	},
	{
		name: "NYC - NewYorkCoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.newyorkcoin;
		},
	},
	{
		name: "OK - OKCash",
		onSelect: function() {
      network = utxofamilyjs.networks.okcash;
		},
	},
	{
		name: "PINK - Pinkcoin",
		onSelect: function() {
      network = utxofamilyjs.networks.pinkcoin;
		},
	},
	{
		name: "PIRL - Pirl",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "PIVX - PIVX",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.pivx;
		},
	},
	{
		name: "POA - Poa",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "POT - Potcoin",
		onSelect: function() {
			network = utxofamilyjs.networks.potcoin;
		},
	},
	{
		name: "PPC - Peercoin",
		onSelect: function() {
			network = utxofamilyjs.networks.peercoin;
		},
	},
	{
		name: "PUT - Putincoin",
		onSelect: function() {
      network = utxofamilyjs.networks.putincoin;
		},
	},
	{
		name: "RBY - Rubycoin",
		onSelect: function() {
			network = utxofamilyjs.networks.rubycoin;
		},
	},
	{
		name: "RDD - Reddcoin",
		onSelect: function() {
			network = utxofamilyjs.networks.reddcoin;
		},
	},
	{
		name: "RVR - RevolutionVR",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.revolutionvr;
		},
	},
	{
		name: "SLR - Solarcoin",
		onSelect: function() {
      network = utxofamilyjs.networks.solarcoin;
		},
	},
	{
		name: "SMART - Smartcash",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.smartcash;
		},
	},
	{
		name: "SMLY - Smileycoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.smileycoin;
		},
	},
	{
		name: "STRAT - Stratis",
		onSelect: function() {
      network = utxofamilyjs.networks.stratis;
		},
	},
	{
		name: "SYS - Syscoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.syscoin;
		},
	},
	{
		name: "TOA - Toacoin",
		onSelect: function() {
      network = utxofamilyjs.networks.toacoin;
		},
	},
	{
		name: "TRON - Tron",
		onSelect: function() {
      network = null;
		},
	},
	{
		name: "UNO - Unobtanium",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.unobtanium;
		},
	},
	{
		name: "USDT - TetherUS",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.bitcoin;
		},
	},
	{
		name: "USNBT - NuBits",
    onSelect: function() {
      network = utxofamilyjs.networks.nubits;
    },
	},
	{
		name: "VASH - Vpncoin",
		onSelect: function() {
      network = utxofamilyjs.networks.vpncoin;
		},
	},
	{
		name: "VIA - Viacoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.viacoin;
		},
	},
	{
		name: "VIVO - Vivo",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.vivo;
		},
	},
	{
		name: "VTC - Vertcoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.vertcoin;
		},
	},
	{
		name: "WC - Wincoin",
		onSelect: function() {
      network = utxofamilyjs.networks.wincoin;
		},
	},
	{
		name: "XBC - Bitcoin Plus",
		onSelect: function() {
      network = utxofamilyjs.networks.bitcoinplus;
		},
	},
	{
		name: "XEM - NEM",
		onSelect: function() {
      network = null;
		},
	},
	{
		name: "XMR - Monero",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "XMY - Myriad",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.myriadcoin;
		},
	},
	{
		name: "XZC - Zcoin",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.zcoin;
		},
	},
	{
		name: "XRP - Ripple",
    onSelect: function() {
      network = null;
    },
	},
	{
		name: "XVC - Vcash",
		onSelect: function() {
			network = bitcoinjs.bitcoin.networks.bitcoin;
		},
	},
	{
		name: "XVG - Verge",
		onSelect: function() {
      network = utxofamilyjs.networks.verge;
		},
	},
	{
		name: "XWC - Whitecoin",
		onSelect: function() {
			network = utxofamilyjs.networks.whitecoin;
		},
	},
	{
		name: "ZEC - Zcash",
    onSelect: function() {
      network = utxofamilyjs.networks.zcash;
    },
	},
	{
		name: "ZEN - Horizen",
    onSelect: function() {
			network = bitcoinjs.bitcoin.networks.horizen;
    },
	},
	{
		name: "ZCL - Zclassic",
    onSelect: function() {
      network = utxofamilyjs.networks.zcash;
    },
	},
  ]

  init();

})();
