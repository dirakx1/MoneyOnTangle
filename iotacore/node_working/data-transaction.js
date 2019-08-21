// Require the IOTA libraries
const Iota = require('@iota/core');
const Converter = require('@iota/converter');
// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

// Example address
const address =
'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD';
// Example seed
const seed =
'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';

const message = Converter.asciiToTrytes('Sending! 1.5 dollars');

const transfers = [
{
    value: 0,  // Number of tokens to transfer
    address: address, // Address
    message: message  // Message
}
];

iota.prepareTransfers(seed, transfers)
    .then(trytes => {
        return iota.sendTrytes(trytes, 3/*depth*/, 9/*minimum weight magnitude*/)
    })
    .then(bundle => {
    console.log(`Bundle: ${JSON.stringify(bundle, null, 1)}`)
})
.catch(err => {
        // Catch any errors
    console.log(err);
});
