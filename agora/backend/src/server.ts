import 'dotenv/config';
import app from './presentation/app';

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🏛️ Ágora Backend rodando na porta ${PORT}`);
});
