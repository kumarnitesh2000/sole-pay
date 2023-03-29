module.exports = class ErrorResponse{
    constructor(_message,_status){
        this.message = _message;
        this.status = _status;
    }
    getErrorResponse(){
        return {
            message: this.message,
            status: this.status
        }
    }
}