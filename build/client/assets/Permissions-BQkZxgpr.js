import{r as c,v as q,j as s}from"./vendor-react-D3RE0R8o.js";import{c as V,d as T}from"./vendor-router-C5YTkdq4.js";import{a as g}from"./api-BB9j10S9.js";import{r as u}from"./roles.service-CRlzX88Y.js";import{u as L}from"./notification.service-CvsIel6B.js";const M={getAllPermissions:async()=>(await g.get("/permissions/all")).data},b={createRolesPermissions:async t=>(await g.post("/rolePermissions",t,{headers:{"Content-Type":"application/json"}})).data,getRolePermissions:async t=>(await g.get(`/rolePermissions/RoleId${t}`)).data};function K(){const{id:t}=V(),a=T(),l=!!t,d=L(e=>e.showToast),[,w]=c.useState([]),[y,N]=c.useState([]),[i,x]=c.useState([]),[f,P]=c.useState(null),{register:k,handleSubmit:v,formState:{errors:m},setValue:R,watch:F}=q({defaultValues:{roleName:""}});F("roleName");const S=i.length>0;c.useEffect(()=>{if(E(),l&&t){const e=Number(t);P(e),C(e),D(e)}},[t,l]);const E=async()=>{try{const e=await M.getAllPermissions();w(e||[]),A(e||[])}catch(e){console.error("Erro ao buscar permissões:",e)}},A=e=>{const r={create:"create",read:"view",patch:"edit",delete:"delete"},o={};for(const n of e){const[h,z]=n.permission.split("/"),j=r[z];j&&(o[h]||(o[h]={resource:h,actions:{}}),o[h].actions[j]=n.id)}N(Object.values(o))},C=async e=>{try{const r=await b.getRolePermissions(e);x(r.permissionsId||[])}catch(r){console.error("Erro ao carregar permissões do role:",r)}},D=async e=>{try{const r=await u.getRole(e);R("roleName",r.name)}catch(r){console.error("Erro ao carregar role:",r)}},p=(e,r)=>{r.target.checked?x(o=>[...o,e]):x(o=>o.filter(n=>n!==e))},B=async e=>{if(!e.roleName||e.roleName.length<5||i.length===0){d("Alerta","Os campos com * são obrigatórios","warning");return}const r={name:e.roleName};try{if(l&&f){await u.updateRole(f,r);const o={role:r.name,permissionId:i};await b.createRolesPermissions(o),d("Sucess","Permission group edit successfully","success"),a("/roles")}else{await u.createRole(r);const o={role:r.name,permissionId:i};await b.createRolesPermissions(o),d("Sucess","Permission group created successfully","success"),a("/roles")}}catch(o){const n=o.response?.data?.message||"Falha ao salvar permissões";d("Error",n,"error")}},I=()=>{a("/roles")};return s.jsxs("form",{onSubmit:v(B),children:[s.jsxs("div",{className:"permissions-container",children:[s.jsx("header",{className:"header",children:s.jsx("h1",{children:"Permissions"})}),s.jsx("section",{className:"permissions-section",children:s.jsxs("div",{className:"input-group",children:[s.jsx("label",{htmlFor:"user-search",children:"Name *"}),s.jsx("input",{type:"text",id:"user-search",className:"input-field",placeholder:"Enter user name",...k("roleName",{required:"Role name is required.",minLength:{value:5,message:"Role must be at least 5 characters long."}})}),m.roleName&&s.jsx("span",{className:"error-message",children:m.roleName.type==="required"?"Role name is required.":m.roleName.type==="minLength"?"Role must be at least 5 characters long.":m.roleName.message})]})}),s.jsx("section",{className:"table-section",children:s.jsx("div",{className:"permissions-card",children:s.jsxs("table",{className:"permissions-table",children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{style:{textAlign:"left"},children:"Permissions"}),s.jsx("th",{children:"View"}),s.jsx("th",{children:"Edit"}),s.jsx("th",{children:"Create"}),s.jsx("th",{children:"Delete"})]})}),s.jsx("tbody",{children:y.map((e,r)=>s.jsxs("tr",{children:[s.jsx("td",{style:{textAlign:"left"},children:e.resource}),s.jsx("td",{children:e.actions.view&&s.jsx("input",{type:"checkbox",className:"permission-radio",checked:i.includes(e.actions.view),onChange:o=>p(e.actions.view,o)})}),s.jsx("td",{children:e.actions.create&&s.jsx("input",{type:"checkbox",className:"permission-radio",checked:i.includes(e.actions.create),onChange:o=>p(e.actions.create,o)})}),s.jsx("td",{children:e.actions.edit&&s.jsx("input",{type:"checkbox",className:"permission-radio",checked:i.includes(e.actions.edit),onChange:o=>p(e.actions.edit,o)})}),s.jsx("td",{children:e.actions.delete&&s.jsx("input",{type:"checkbox",className:"permission-radio",checked:i.includes(e.actions.delete),onChange:o=>p(e.actions.delete,o)})})]},r))})]})})}),s.jsxs("div",{className:"action-buttons",children:[s.jsx("button",{type:"button",className:"cancel-btn",onClick:I,children:"Cancel"}),s.jsx("button",{type:"submit",className:"create-btn",disabled:!S,children:l?"Edit":"Create"})]})]}),s.jsx("style",{children:`
        .permissions-container {
          position: relative;
          padding: 20px;
          min-height: 100vh;
          background-color: #f8f9fc;
        }

        h1 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 42px;
          color: #2A3547;
          margin-bottom: 40px;
        }

        label {
          font-size: 16px;
          font-weight: bold;
          color: #FB7F0D;
          margin-bottom: 5px;
          display: block;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          border-radius: 4px;
          border: 2px solid #FB7F0D;
          color: #2A3547;
          background-color: white;
          outline: none;
        }

        .error-message {
          margin-top: 10px;
          font-size: 13px;
          color: red;
        }

        th {
          font-weight: bold;
          color: #2A3547;
          text-transform: uppercase;
          background-color: transparent;
        }

        .permissions-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-top: 20px;
        }

        .permissions-table {
          width: 100%;
          border-collapse: collapse;
        }

        .permissions-table th,
        .permissions-table td {
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #E0E0E0;
        }

        .permissions-table th {
          font-weight: bold;
          color: #2A3547;
        }

        .permissions-table tr:last-child td {
          border-bottom: none;
        }

        .permission-radio {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #FB7F0D;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          cursor: pointer;
        }

        .permission-radio:checked {
          background-color: #FB7F0D;
          box-shadow: inset 0 0 0 3px white;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .cancel-btn {
          background: none;
          border: 2px solid #FB7F0D;
          color: #FB7F0D;
          border-radius: 5px;
          padding: 10px 40px 10px 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .create-btn {
          background: none;
          border: 2px solid #282F5D;
          color: #282F5D;
          border-radius: 5px;
          padding: 10px 40px 10px 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .create-btn:disabled {
          background-color: #ccc;
          color: #666;
          cursor: not-allowed;
          box-shadow: none;
          opacity: 0.7;
        }
      `})]})}export{K as default};
