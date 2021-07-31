export const LoginSuccessMessage = "You successfully logged in."
export const LoginFailMessage = "Your ID or password doesn't match."
export const PasswordMatchingFailedMessage = "Password do not match"
export const RegisterFailMessage = "Register failed. Try again."
export const RegisterIDFailMessage = "ID already exists"
export const baseIP = 'http://54.180.82.60/'
export const ServerIP = `${baseIP}app/`
export const ImageIP = `${baseIP}image/`

export const activityDot = {key:'activity', color: 'red', selectedDotColor: 'red'};
export const weightDot = {key:'weight', color: 'blue', selectedDotColor: 'blue'};

export function uploadOption(method, body) {
    return{
        method: method,
        body: body,
        redirect: 'follow'
    };
}
export const getOption = {
    method: 'GET'
};
export const chartOption = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
    borderRadius: 16
    },
    propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
    }
}