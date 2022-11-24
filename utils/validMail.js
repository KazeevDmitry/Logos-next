export default function validMail(value) {
    const re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    const valid = re.test(value);
    return valid;
}
