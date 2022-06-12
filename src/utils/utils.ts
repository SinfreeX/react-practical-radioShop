import axios from "axios";

export const parseAxiosError = (e: any) => {
    let data
    if (axios.isAxiosError(e)) data = e.response?.data as any
    if (!data) return false
    if (Array.isArray(data)) return false //Массивом отвечает валидатор dto
    if ('statusCode' in data) return data.message as string
    return false
}