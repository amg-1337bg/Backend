FROM node

WORKDIR /backend

RUN npm install prisma

CMD npm i && npx prisma generate && npm run start:dev