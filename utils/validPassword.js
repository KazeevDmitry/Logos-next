// TODO: use './validation.js' and Form, Form.Item from antd

export default function validPassword(value) {
    const re = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
    const valid = re.test(value);
    return valid;
}  
