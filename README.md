# Crypto Transaction decoder

A tool for decoding crypto transactions, that takes as input the raw bytes of a transaction in hex format and
prints as output transaction-related information that can be decoded from the input.

## Supported Coins

* Bitcoin (including BTC-based coins like DOGE, LTC, BSV, BCH etc)
* ZCash (including ZCash-based coins)
* Peercoin (including Peercoin-based coins)
* Monero
* Ripple
* Ethereum (including ERC20 tokens)
* TRON (including TRC10 tokens)
* BNB (including BEP2 tokens)
* NEM (including NEM tokens)
* AION
* Ark
* Algorand

## Examples

### Bitcoin

https://blockchair.com/bitcoin/transaction/2b37954e4823480d037c90f4412f3a3e8740b99d8e56efadba508dd0c2f0296b
```
// INPUT: 02000000013fcd314f05034a76f5ddfbc410b1eecd7e40101ce30cedf4997800a2a32bd68d010000006b483045022100d9ce123ffccdd4f575ce1c073b5d03a7c4043debc327f17b7867d5eed4716d1a02204500b63e4f9ddc4edd85f807b72ef90b2b3f8bd9a8c67dd7a916116a5a1785e3012102f0f9d11b18beb6199d6c41d922a8547488c36c68a3662e5ed06ff580a781014fffffffff0240b7b700000000001976a91403cb5efdafc50debcad723a792a2f25de50ff89a88ac1fb9ea0d000000001976a914280b0317c29cd3ae62a1615869b777830446abb588ac00000000

/* Output
{
  "version": 2,
  "locktime": 0,
  "inputs": [
    {
      "prev_hash": "8dd62ba3a2007899f4ed0ce31c10407ecdeeb110c4fbddf5764a03054f31cd3f",
      "index": 1,
      "script": "483045022100d9ce123ffccdd4f575ce1c073b5d03a7c4043debc327f17b7867d5eed4716d1a02204500b63e4f9ddc4edd85f807b72ef90b2b3f8bd9a8c67dd7a916116a5a1785e3012102f0f9d11b18beb6199d6c41d922a8547488c36c68a3662e5ed06ff580a781014f",
      "script_type": "pubkeyhash",
      "sequence": 4294967295,
      "witness": []
    }
  ],
  "outputs": [
    {
      "value": 12040000,
      "address": "1M4f3aDRAVVfquRrWW7JEa3JVJHSvDv5U",
      "script": "76a91403cb5efdafc50debcad723a792a2f25de50ff89a88ac",
      "script_type": "pubkeyhash"
    },
    {
      "value": 233486623,
      "address": "14ejDokWwoRopdWragSsSozKPoFdd5cr5K",
      "script": "76a914280b0317c29cd3ae62a1615869b777830446abb588ac",
      "script_type": "pubkeyhash"
    }
  ]
}*/
```


### Ethereum

https://blockchair.com/ethereum/transaction/0xb6ec585a6ff0a2b86298679a915711606af3fdbdd4f07339c3fc07c207692e19
```
// INPUT: 0xf86c81e485012a05f200825208944fed1fc4144c223ae3c1553be203cdfcbd38c58187b18458180e90938026a06476453ec126c247d3031dc8a1b1b6a405342dacc2ae5ddb75508b32c0604e44a05b4b721fbbff7a50bf67624db54519cba6c155a7f88e404ad6d21329d093c225

/* Output
{
  "nonce": 228,
  "gasPrice": 5000000000,
  "gasLimit": 21000,
  "to": "0x4fed1fc4144c223ae3c1553be203cdfcbd38c581",
  "valueInWei": 49966584773382290,
  "valueInEther": 0.04996658477338229,
  "inputData": "0x",
  "v": "0x26",
  "r": "0x6476453ec126c247d3031dc8a1b1b6a405342dacc2ae5ddb75508b32c0604e44",
  "s": "0x5b4b721fbbff7a50bf67624db54519cba6c155a7f88e404ad6d21329d093c225"
}*/
```


### Litecoin

https://blockchair.com/litecoin/transaction/4f11a7a2aca3cf3769d5d925df3dbcc9e5619de8b39b20d0c71f27e5cb88dd3e
```
// INPUT: 02000000000101fb3b5ed6ffe0928bd0352079c1b9b12c67edef85907c774ab642a44ccf61ac780100000017160014f27b256bd7632d898714049e52329ae483f976a6ffffffff02c25d0300000000001976a914ab30c3acf05ecf55e0dff4008bb4fba9636d7a1e88ac9cd981060000000017a914df72bf3c060b504b6a82094206f773adad5a7b25870247304402203259f433b9bbaf74bb59421064a93e055c28f509000b9bb678c3adbdb96a01440220580dd7596741e9f8414ada8bbb6cecff08b279e84eddb86ba23992e73975fd39012103b86e901e0f5a40cb45d524f1b745ae22a8607d8d08467945fcef3de11cd5247f00000000

/* Output
{
  "version": 2,
  "locktime": 0,
  "inputs": [
    {
      "prev_hash": "78ac61cf4ca442b64a777c9085efed672cb1b9c1792035d08b92e0ffd65e3bfb",
      "index": 1,
      "script": "160014f27b256bd7632d898714049e52329ae483f976a6",
      "script_type": "scripthash",
      "sequence": 4294967295,
      "witness": [
        "304402203259f433b9bbaf74bb59421064a93e055c28f509000b9bb678c3adbdb96a01440220580dd7596741e9f8414ada8bbb6cecff08b279e84eddb86ba23992e73975fd3901",
        "03b86e901e0f5a40cb45d524f1b745ae22a8607d8d08467945fcef3de11cd5247f"
      ]
    }
  ],
  "outputs": [
    {
      "value": 220610,
      "address": "Laq8EDtMdBF7cPXPai42yn1ydFoPHj9EFV",
      "script": "76a914ab30c3acf05ecf55e0dff4008bb4fba9636d7a1e88ac",
      "script_type": "pubkeyhash"
    },
    {
      "value": 109173148,
      "address": "MUGeNyEb6coibqco6KwmQR7PqRHDhGodCZ",
      "script": "a914df72bf3c060b504b6a82094206f773adad5a7b2587",
      "script_type": "scripthash"
    }
  ]
}*/
```


### Ripple

https://xrpcharts.ripple.com/#/transactions/31D00FDC13F952068367C8AE4558332FA97B8F49136A7E0BD721B7274E34333B
```
// INPUT:
120000228000000024000000286140000000000f4240684000000000000014732103d5be8ac836b80537ee4f45ccc1dcb84267d76631299caf0e96f238a8ac99c78c74463044022015696d3c04401267771105c11dd4265eeb49560a39e0215e4982e5324310a3420220608fa27baef3b64957d3f1bb7ae2aedd58803dad02d7fc4ef7f7e81bff9ec5808114dcc909918dbeb8a3bf29781d609fae12b44eb41583142f970e84c22b369df3837c425c0bde850e74f983

/* Output
{
  "TransactionType": "Payment",
  "Flags": 2147483648,
  "Sequence": 40,
  "Amount": "1000000",
  "Fee": "20",
  "SigningPubKey": "03D5BE8AC836B80537EE4F45CCC1DCB84267D76631299CAF0E96F238A8AC99C78C",
  "TxnSignature": "3044022015696D3C04401267771105C11DD4265EEB49560A39E0215E4982E5324310A3420220608FA27BAEF3B64957D3F1BB7AE2AEDD58803DAD02D7FC4EF7F7E81BFF9EC580",
  "Account": "rM3QVXRZck2sdwEBfvRCrCgMoEFc5PZdFd",
  "Destination": "rnLd5czEGGzEXvewwsowUPEHCu2BihjSzF"
}*/
```


### BNB

https://explorer.binance.org/tx/ebb33a49611e220470d644de1868ac655e5c985866be03eb79443d70ffd49fd7
```
// INPUT: c401f0625dee0a4a2a2c87fa0a210a144dd47293c5496f8c824905949be1df9231999cf212090a03424e4210c0843d12210a14114df167af82cdccc08cbc9e9b9201cd81c8aa2112090a03424e4210c0843d12700a26eb5ae987210270d855fa0e7555d9c3de613f832fc46e58199905c024a99457e0ff0b753f21b712403f3dabec5a76b81247e64a0c0f4e5bf81cfac885819e7b3c9e2e4f548b32de3019f8b755e53cba218c171d930c0b5883c17a258cd37258ab51797c60b8936c081896af0a2021200c

/* Output
{
  "msg": [
    {
      "inputs": [
        {
          "address": "bnb1fh289y79f9hceqjfqk2fhcwljgcen88jqrd7el",
          "coins": [
            {
              "denom": "BNB",
              "amount": 1000000
            }
          ]
        }
      ],
      "outputs": [
        {
          "address": "bnb1z9xlzea0stxuesyvhj0fhyspekqu323p8644h6",
          "coins": [
            {
              "denom": "BNB",
              "amount": 1000000
            }
          ]
        }
      ],
      "msgType": "MsgSend"
    }
  ],
  "signatures": [
    {
      "pub_key": "eb5ae987210270d855fa0e7555d9c3de613f832fc46e58199905c024a99457e0ff0b753f21b7",
      "signature": "3f3dabec5a76b81247e64a0c0f4e5bf81cfac885819e7b3c9e2e4f548b32de3019f8b755e53cba218c171d930c0b5883c17a258cd37258ab51797c60b8936c08",
      "account_number": 169878,
      "sequence": 33
    }
  ],
  "memo": "",
  "source": 12,
  "data": "",
  "msgType": "StdTx"
}*/
```


### Bitcoin Cash

https://blockchair.com/bitcoin-cash/transaction/fd8d104f7cf5e88fb4639c3384a6745d855dc00e9633cdc8749135dc4b3705ca
```
// INPUT: 020000000112956a21f0c7b99baf058edc1de9c53a4b15671bfe3550a2cd93f5bc2a1dd77801000000fc0047304402203c755dd93263ddaed99fe30dd060d47184e3b0571b8df38a1ea5f9990c48cd7302204ab258d58532018c700304dc998d77facdcad75ea1c608c0858744672488cbe441473044022013ad14689c05d99ee3092560ac914ea9ae400e41adf57e6058bfc33b306515cf022029b4c37c13efb56da2b8f1e351d6b1aa5aec9e68212298be68243688951ea854414c69522102a3d225b6b63827f88670ef45086352007229f2d2052441301c10de2e591cb3b52103103356be14bde77ef170eb3dfb80ecf5a9bd95f7a11b92ce34bf093adffcb3a5210229a16c3a5f8735d2a44314e96df89c4f7854ad8f8fd699d03d5aee774d3973eb53aeffffffff0200e1f5050000000017a9147115323f1eba897a8ed0532ec391674ac3f9c4e4871a8651ef0300000017a91436677d62de286eb8d5015adc93be8666568d10db873a920900

/* Output
{
  "version": 2,
  "locktime": 627258,
  "inputs": [
    {
      "prev_hash": "78d71d2abcf593cda25035fe1b67154b3ac5e91ddc8e05af9bb9c7f0216a9512",
      "index": 1,
      "script": "0047304402203c755dd93263ddaed99fe30dd060d47184e3b0571b8df38a1ea5f9990c48cd7302204ab258d58532018c700304dc998d77facdcad75ea1c608c0858744672488cbe441473044022013ad14689c05d99ee3092560ac914ea9ae400e41adf57e6058bfc33b306515cf022029b4c37c13efb56da2b8f1e351d6b1aa5aec9e68212298be68243688951ea854414c69522102a3d225b6b63827f88670ef45086352007229f2d2052441301c10de2e591cb3b52103103356be14bde77ef170eb3dfb80ecf5a9bd95f7a11b92ce34bf093adffcb3a5210229a16c3a5f8735d2a44314e96df89c4f7854ad8f8fd699d03d5aee774d3973eb53ae",
      "script_type": "nonstandard",
      "sequence": 4294967295,
      "witness": []
    }
  ],
  "outputs": [
    {
      "value": 100000000,
      "address": "bitcoincash:ppc32v3lr6agj75w6pfjasu3va9v87wyusrdv7kk49",
      "script": "a9147115323f1eba897a8ed0532ec391674ac3f9c4e487",
      "script_type": "scripthash"
    },
    {
      "value": 16899999258,
      "address": "bitcoincash:pqmxwltzmc5xawx4q9ddeya7sen9drgsmv448krn98",
      "script": "a91436677d62de286eb8d5015adc93be8666568d10db87",
      "script_type": "scripthash"
    }
  ]
}*/
```


### Bitcoin SV

https://blockchair.com/bitcoin-sv/transaction/f991281ffaaf87c0e58c2bc1576a1e65a01c669e3b57eb2006dafa90febbd35a
```
// INPUT: 0xf86c81e485012a05f200825208944fed1fc4144c223ae3c1553be203cdfcbd38c58187b18458180e90938026a06476453ec126c247d3031dc8a1b1b6a405342dacc2ae5ddb75508b32c0604e44a05b4b721fbbff7a50bf67624db54519cba6c155a7f88e404ad6d21329d093c225

/* Output
{
  "nonce": 228,
  "gasPrice": 5000000000,
  "gasLimit": 21000,
  "to": "0x4fed1fc4144c223ae3c1553be203cdfcbd38c581",
  "valueInWei": 49966584773382290,
  "valueInEther": 0.04996658477338229,
  "inputData": "0x",
  "v": "0x26",
  "r": "0x6476453ec126c247d3031dc8a1b1b6a405342dacc2ae5ddb75508b32c0604e44",
  "s": "0x5b4b721fbbff7a50bf67624db54519cba6c155a7f88e404ad6d21329d093c225"
}*/
```


### Dash

https://blockchair.com/dash/transaction/ade43ec0cb8e7b7e5d46d890eaccc227bc78bd33ab0bcd52c8bc1377958c8916
```
// INPUT: 02000000011813e2b6a8d033eaeca22bd92dfef5194c5e12c3bdeb5ca51a56288d04025ecc010000006b483045022100bec9affd1cebeba570efe298206a0219c5b25c77e8b88a3be6d043548855a777022071bfeb4624b6a639767dd2b041423889aaed82faa469e89279e00c489534716b012102afcbf3d3ff89f4d4e428d2b791cd2ea258cbb9495ccec825b4a640e8333aead6ffffffff015b600602000000001976a9148a647acc357cb0c09ed463d77735692daef0f94b88ac00000000

/* Output
{
  "version": 2,
  "locktime": 0,
  "inputs": [
    {
      "prev_hash": "cc5e02048d28561aa55cebbdc3125e4c19f5fe2dd92ba2ecea33d0a8b6e21318",
      "index": 1,
      "script": "483045022100bec9affd1cebeba570efe298206a0219c5b25c77e8b88a3be6d043548855a777022071bfeb4624b6a639767dd2b041423889aaed82faa469e89279e00c489534716b012102afcbf3d3ff89f4d4e428d2b791cd2ea258cbb9495ccec825b4a640e8333aead6",
      "script_type": "pubkeyhash",
      "sequence": 4294967295,
      "witness": []
    }
  ],
  "outputs": [
    {
      "value": 33972315,
      "address": "XoJbTBC3Sx6RcKDGumpQ4k3k83QukvjRat",
      "script": "76a9148a647acc357cb0c09ed463d77735692daef0f94b88ac",
      "script_type": "pubkeyhash"
    }
  ]
}*/
```


### Dogecoin

https://blockchair.com/dogecoin/transaction/f919dcadfe18d94d040962e5ccf9587ffd838a89c562ec98d423cb1ae3d63cab
```
// INPUT: 0100000001b70ef91c30814fb772917d14e6f57e3102f62c4ea11a80ccb2c6e447335c4f7101000000da004830450221008d1836f2bef78f65aea1b559c352cbc5e9b259e03e01c3f5d64a0c22cb9d78cd02207466ee6a664fa524622ce5acbba72f4ecb1154fab4a29580de83019220c8d38401473044022049f8da576341c505263b3e87d3ec80f0e307249fe3615df83e235c39dd14b5ae022001595a157b9f94424d1e95c0117a411215c58cc0a99d5d2a1f3bf7794aed1ff801475221023182755ed85200916dd78f1170bcd3e24b9bf5565728104cc62dfe6e821d3c3221039bb3464321016b1f98db8d4931389a75fa022b22dd7d975eb1c6d121c9c3eff352aeffffffff0200f15365000000001976a9149577470064ade10f0ae6180f539b496128f8ff0588ac401cc90ab600000017a91402e1e7691cc8cc070fc3341781ba384bae2402468700000000

/* Output
{
  "version": 1,
  "locktime": 0,
  "inputs": [
    {
      "prev_hash": "714f5c3347e4c6b2cc801aa14e2cf602317ef5e6147d9172b74f81301cf90eb7",
      "index": 1,
      "script": "004830450221008d1836f2bef78f65aea1b559c352cbc5e9b259e03e01c3f5d64a0c22cb9d78cd02207466ee6a664fa524622ce5acbba72f4ecb1154fab4a29580de83019220c8d38401473044022049f8da576341c505263b3e87d3ec80f0e307249fe3615df83e235c39dd14b5ae022001595a157b9f94424d1e95c0117a411215c58cc0a99d5d2a1f3bf7794aed1ff801475221023182755ed85200916dd78f1170bcd3e24b9bf5565728104cc62dfe6e821d3c3221039bb3464321016b1f98db8d4931389a75fa022b22dd7d975eb1c6d121c9c3eff352ae",
      "script_type": "scripthash",
      "sequence": 4294967295,
      "witness": []
    }
  ],
  "outputs": [
    {
      "value": 1700000000,
      "address": "DJmQ7NoYpwFpEMszUmmgwQMg3zehecjMpg",
      "script": "76a9149577470064ade10f0ae6180f539b496128f8ff0588ac",
      "script_type": "pubkeyhash"
    },
    {
      "value": 781865000000,
      "address": "9rhWdrXyrg2o11VhTHgtt68mCKXUyqsbWB",
      "script": "a91402e1e7691cc8cc070fc3341781ba384bae24024687",
      "script_type": "scripthash"
    }
  ]
}*/
```

## Making changes

Please do not make modifications to `transaction-decoder-standalone.html`, since they will
be overwritten by `compile.py`.

Make changes in `src/*`.
