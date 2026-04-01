import app from './presentation/app';

const PORT = 8000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🏛️ Ágora Backend rodando na porta ${PORT}`);
});
