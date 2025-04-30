import countries from "@/assets/country_blocklist.json"
export default defineNuxtRouteMiddleware(async (to, from) => {

  if (import.meta.server) {
    const ipAddress = useRequestHeaders(['x-forwarded-for'])['x-forwarded-for']
    if(ipAddress === '127.0.0.1') return true
    const res: any = await $fetch('https://api.iplocation.net/', {
      params: {
        ip: ipAddress,
      }
    })
    const isBlocked = (countries.map(c =>
        c.code.toUpperCase()).includes(res['country_code2'].toUpperCase())
    )
    return isBlocked ? navigateTo('/blocked-country') : true
  }
})
