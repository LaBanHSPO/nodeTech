console.log(process.argv[2]);
process.argv.forEach((val, index, array) => {

    console.log(`${index}: ${val}`);
});
