import{u as T,r as c,x as V,j as e}from"./vendor-react-GjWeapsa.js";import{c as G,d as J}from"./vendor-router-cHSbYr8A.js";import{a as f}from"./api-Cdl3BoFR.js";import{r as g}from"./roles.service-CqkRpITf.js";import{u as K}from"./notification.service-DGIhKrzX.js";const O={getAllPermissions:async()=>(await f.get("/permissions/all")).data},b={createRolesPermissions:async o=>(await f.post("/rolePermissions",o,{headers:{"Content-Type":"application/json"}})).data,getRolePermissions:async o=>(await f.get(`/rolePermissions/RoleId${o}`)).data};function X(){const{t:o}=T("translation"),{id:t}=G(),x=J(),l=!!t,d=K(s=>s.showToast),[,P]=c.useState([]),[k,v]=c.useState([]),[n,u]=c.useState([]),[j,R]=c.useState(null),{register:F,handleSubmit:S,formState:{errors:p},setValue:E,watch:A}=V({defaultValues:{roleName:""}});A("roleName");const B=n.length>0;c.useEffect(()=>{if(D(),l&&t){const s=Number(t);R(s),C(s),I(s)}},[t,l]);const D=async()=>{try{const s=await O.getAllPermissions();P(s||[]),z(s||[])}catch(s){console.error("Erro ao buscar permissões:",s)}},z=s=>{const i={create:"create",read:"view",patch:"edit",delete:"delete"},r={};for(const a of s){const y=a.permission.split("/"),w=y[0]??"",M=y[1]??"",N=i[M];if(!N)continue;const h=w.toLowerCase();r[h]||(r[h]={resource:h==="roles"?"Roles":w,actions:{}}),r[h].actions[N]=a.id}v(Object.values(r))},C=async s=>{try{const i=await b.getRolePermissions(s);u(i.permissionsId||[])}catch(i){console.error("Erro ao carregar permissões do role:",i)}},I=async s=>{try{const i=await g.getRole(s);E("roleName",i.name)}catch(i){console.error("Erro ao carregar role:",i)}},m=(s,i)=>{i.target.checked?u(r=>[...r,s]):u(r=>r.filter(a=>a!==s))},q=async s=>{if(!s.roleName||s.roleName.length<5||n.length===0){d(o("common.warning"),o("pages.permissions.requiredFieldsWarning"),"warning");return}const i={name:s.roleName};try{if(l&&j){await g.updateRole(j,i);const r={role:i.name,permissionId:n};await b.createRolesPermissions(r),d(o("common.states.success"),o("pages.permissions.editSuccess"),"success"),x("/roles")}else{await g.createRole(i);const r={role:i.name,permissionId:n};await b.createRolesPermissions(r),d(o("common.states.success"),o("pages.permissions.createSuccess"),"success"),x("/roles")}}catch(r){const a=r.response?.data?.message||o("pages.permissions.saveError");d(o("common.states.error"),a,"error")}},L=()=>{x("/roles")};return e.jsxs("form",{onSubmit:S(q),children:[e.jsxs("div",{className:"permissions-container",children:[e.jsx("header",{className:"header",children:e.jsx("h1",{children:o("pages.permissions.title")})}),e.jsx("section",{className:"permissions-section",children:e.jsxs("div",{className:"input-group",children:[e.jsx("label",{htmlFor:"user-search",children:o("pages.permissions.nameRequired")}),e.jsx("input",{type:"text",id:"user-search",className:"input-field",placeholder:o("pages.permissions.placeholder"),...F("roleName",{required:o("pages.permissions.roleNameRequired"),minLength:{value:5,message:o("pages.permissions.roleNameMinLength")}})}),p.roleName&&e.jsx("span",{className:"error-message",children:p.roleName.type==="required"?o("pages.permissions.roleNameRequired"):p.roleName.type==="minLength"?o("pages.permissions.roleNameMinLength"):p.roleName.message})]})}),e.jsx("section",{className:"table-section",children:e.jsx("div",{className:"permissions-card",children:e.jsxs("table",{className:"permissions-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{textAlign:"left"},children:o("pages.permissions.permissions")}),e.jsx("th",{children:o("pages.permissions.view")}),e.jsx("th",{children:o("pages.permissions.edit")}),e.jsx("th",{children:o("pages.permissions.create")}),e.jsx("th",{children:o("pages.permissions.delete")})]})}),e.jsx("tbody",{children:k.map((s,i)=>e.jsxs("tr",{children:[e.jsx("td",{style:{textAlign:"left"},children:s.resource}),e.jsx("td",{children:s.actions.view!=null?e.jsx("input",{type:"checkbox",className:"permission-radio",checked:n.includes(s.actions.view),onChange:r=>m(s.actions.view,r)}):e.jsx("span",{className:"permission-empty",children:"—"})}),e.jsx("td",{children:s.actions.edit!=null?e.jsx("input",{type:"checkbox",className:"permission-radio",checked:n.includes(s.actions.edit),onChange:r=>m(s.actions.edit,r)}):e.jsx("span",{className:"permission-empty",children:"—"})}),e.jsx("td",{children:s.actions.create!=null?e.jsx("input",{type:"checkbox",className:"permission-radio",checked:n.includes(s.actions.create),onChange:r=>m(s.actions.create,r)}):e.jsx("span",{className:"permission-empty",children:"—"})}),e.jsx("td",{children:s.actions.delete!=null?e.jsx("input",{type:"checkbox",className:"permission-radio",checked:n.includes(s.actions.delete),onChange:r=>m(s.actions.delete,r)}):e.jsx("span",{className:"permission-empty",children:"—"})})]},i))})]})})}),e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{type:"button",className:"cancel-btn",onClick:L,children:o("common.buttons.cancel")}),e.jsx("button",{type:"submit",className:"create-btn",disabled:!B,children:o(l?"common.buttons.edit":"common.buttons.create")})]})]}),e.jsx("style",{children:`
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

        .permission-empty {
          color: #999;
          font-size: 14px;
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
      `})]})}export{X as default};
