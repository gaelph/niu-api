//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @typedef {import("./model").Setting} Setting
 */

 /** */
 const axios = require('axios')
 const { BadRequest } = require("../../error")
 
 const Setting = require('./model')
 
 /**
  * @param {Object} value
  * @return {Promise<Setting>}
  */
 async function create(value) {
   let id = value.id
   delete value.id
   let setting = new Setting(Setting.sanitize(value, undefined))
 
   //@ts-ignore
   setting.entityKey = Setting.key(id)
 
   const { entityKey, entityData } = await setting.save()
 
   // Signal device(s)
   // no need to await the result
   send_settings_to_device()
 
   return {
     ...entityData,
     // @ts-ignore
     id: entityKey.name
   }
 }
 
 async function list() {
   let { entities: settings } = await Setting.list()
 
   return settings
 }
 
 async function update(value) {
   let id = value.id
   
   try {
     try {
       await Setting.get(id)
     } catch (_) {
       return await create(value)
     }
     delete value.id
 
     let { entityKey, entityData } = await Setting.update(id, value, null, null, null, { replace: false })
 
     // Signal device(s)
     // no need to await the result
     send_settings_to_device()
 
     return {
       id: entityKey.name,
       ...entityData
     }
   } catch (error) {
     let message = error.message
     /* istanbul ignore next */
     if (error.name && error.errors) {
       message = error.errors.map(({ message }) => message).join(' ')
     } 
     throw new BadRequest(message)
   }
 }
 
 async function send_settings_to_device() {
   let settings = await list()
 
   try {
     //@ts-ignore
     await axios.post(
       `${process.env.DEVICE_URL}/settings`, 
       JSON.stringify({ settings }),
       {
         headers: {
           "Authorization": `Bearer ${process.env.API_KEY}`,
           "Content-Type": "application/json",
           "Accept": "application/json"
         }
       })
     } catch (error) {
       console.error(error.message)
     }
 }
 
 module.exports = {
   createSetting: create,
   listSettings: list,
   updateSetting: update
 }