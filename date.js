
module.exports.getDate =
    function () {

        const d = new Date();
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long"
        }

        let myDay = d.toLocaleDateString('en-US', options);
        return myDay;

    }

module.exports.getDay =
    function () {

        const d = new Date();
        const options = {
            weekday: "long",

        }

        let myDay = d.toLocaleDateString('en-US', options);
        return myDay;

    }