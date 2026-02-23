
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";


// =========================
// 基础资料
// =========================


export async function sendVerificationCode(
    email?: string,
    phone?: string,
    type?: "EMAIL" | "PHONE"
) {


    const payload = {
        email: email || null,
        phone: phone || null,
        type: type || null,
        lang: "en"
    };

    const res = await clientAPIFrame("/api/user/send-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to send verification code");

    return res.json();
}




export async function verifyCode(
    email?: string,
    phone?: string,
    code?: string,
    type?: "EMAIL" | "PHONE"
) {


    // 1. 先绑定 email 或 phone
    let bindRes
    if (type === "EMAIL") {
        bindRes = await clientAPIFrame("/api/user/email/add", {
            method: "POST",

            body: JSON.stringify({ email, primary: false,code,type }),
        })
    } else {
        bindRes = await clientAPIFrame("/api/user/phone/add", {
            method: "POST",

            body: JSON.stringify({ phone, primary: false,code, type}),
        })
    }

    if (!bindRes.ok) throw new Error("Failed to bind email/phone")
    const bindObj = await bindRes.json()   // { id: number }

    // 2. 调用 verify 接口
    const verifyUrl =
        type === "EMAIL"
            ? `/api/user/email/${bindObj.id}/verify`
            : `/api/user/phone/${bindObj.id}/verify`

    const verifyRes = await clientAPIFrame(verifyUrl, {
        method: "POST",

    })

    if (!verifyRes.ok) throw new Error("Failed to verify code")

    return verifyRes.text()
}







export async function updateProfile(payload: Partial<{ displayName: string; avatarUrl: string }>) {


    const requestPayload = {
        displayName: payload.displayName ?? undefined,

    };

    const res = await clientAPIFrame("/api/user/profile", {
        method: "PATCH",

        body: JSON.stringify(requestPayload),
    });

    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
}


// 上传头像
export async function uploadAvatar( file: File) {
    const form = new FormData()
    form.append("file", file)

    const res = await clientAPIFrame("/api/user/upload/avatar", {
        method: "POST",
        body: form
    })

    if (!res.ok) throw new Error("Upload failed")
    return res.json() // { url: "xxx" }
}

// =========================
// 地址
// =========================

export async function getAddressList() {
    const res = await clientAPIFrame("/api/user/address/list", {

    })
    if (!res.ok) throw new Error("Failed to load addresses")
    return res.json()
}

export async function addAddress(payload: Record<string, unknown>) {
    const res = await clientAPIFrame("/api/user/address/add", {
        method: "POST",
        body: JSON.stringify(payload)
    })
    return res.json()
}

export async function updateAddress(id: number, payload: Record<string, unknown>) {
    const res = await clientAPIFrame(`/api/user/address/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    })
    return res.json()
}

export async function deleteAddress( id: number) {
    await clientAPIFrame(`/api/user/address/delete/${id}`, {
        method: "DELETE",
        
    })
}

export async function setDefaultAddress( id: number) {
    await clientAPIFrame(`/api/user/address/default/${id}`, {
        method: "POST",

    })
}

// =========================
// 支付方式
// =========================

export async function getPaymentList() {
    const res = await clientAPIFrame("/api/user/payment-methods/list", {

    })
    if (!res.ok) throw new Error("Failed to load payments")
    return res.json()
}



export async function deletePayment(id: number) {
    await clientAPIFrame(`/api/user/payment-methods/${id}/delete`, {
        method: "DELETE",

    })
}

export async function setDefaultPayment( id: number) {
    await clientAPIFrame(`/api/user/payment-methods/${id}/default`, {
        method: "POST",

    })
}
