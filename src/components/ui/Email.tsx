import {
  Tailwind,
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Column,
  Row,
  Text,
  Heading,
  Button,
  Hr,
} from "react-email";

interface EmailProps {
  fromName?: string;
  fromEmail?: string;
  toEmail?: string;
  subject?: string;
  content?: string;
  year?: number;
}

export const Email = ({
  fromName = "Usuario",
  fromEmail = "usuario@ejemplo.com",
  toEmail = "destinatario@ejemplo.com",
  subject = "Nuevo mensaje",
  content = "Este es el contenido del mensaje.",
  year = new Date().getFullYear(),
}: EmailProps) => {
  return (
    <Tailwind>
      <Html lang="es">
        <Head />
        <Preview>{`${fromName} te ha enviado un mensaje: ${subject}`}</Preview>
        <Body className="bg-neutral-100 font-sans py-5">
          <Container className="bg-white border border-neutral-200 rounded-xl mx-auto max-w-150 overflow-hidden shadow-sm">
            <Section className="bg-neutral-900 p-10 text-center">
              <Heading className="text-white text-3xl font-semibold m-0 mb-2">
                Nuevo mensaje
              </Heading>
              <Text className="text-neutral-400 text-sm m-0">
                Enviado desde My App
              </Text>
            </Section>

            <Section className="p-10">
              <Text className="text-base text-neutral-700 mb-5">Hola,</Text>
              <Text className="text-sm text-neutral-600 mb-6 leading-relaxed">
                Has recibido un nuevo mensaje de{" "}
                <strong className="text-neutral-900">{fromName}</strong>:
              </Text>

              <Section className="bg-neutral-50 rounded-lg p-5 mb-6 border border-neutral-200">
                <Row className="mb-3">
                  <Column className="w-16 align-top">
                    <Text className="text-xs font-semibold text-neutral-500 m-0 uppercase tracking-wide">
                      De:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-sm text-neutral-800 m-0 wrap-break-word">
                      {fromName} &lt;{fromEmail}&gt;
                    </Text>
                  </Column>
                </Row>
                <Row className="mb-3">
                  <Column className="w-16 align-top">
                    <Text className="text-xs font-semibold text-neutral-500 m-0 uppercase tracking-wide">
                      Para:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-sm text-neutral-800 m-0 wrap-break-word">
                      {toEmail}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-16 align-top">
                    <Text className="text-xs font-semibold text-neutral-500 m-0 uppercase tracking-wide">
                      Asunto:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-sm font-semibold text-neutral-800 m-0 wrap-break-word">
                      {subject}
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="bg-neutral-50 p-5 rounded-lg mb-8 border border-neutral-200">
                <Text className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Mensaje:
                </Text>
                <Text className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap m-0">
                  {content}
                </Text>
              </Section>

              <Section className="text-center mb-8">
                <Button
                  href="https://tu-app.com"
                  className="bg-neutral-900 rounded-lg text-white text-sm font-medium no-underline text-center inline-block py-3 px-8 hover:bg-neutral-800 transition-colors"
                >
                  Responder ahora
                </Button>
              </Section>

              <Hr className="border-neutral-200 my-8" />

              <Text className="text-neutral-400 text-xs text-center mb-2">
                Este correo fue enviado desde la aplicación My App
              </Text>
              <Text className="text-neutral-400 text-xs text-center">
                &copy; {year} My App - Todos los derechos reservados
              </Text>
              <Text className="text-neutral-300 text-[10px] text-center mt-4">
                Si no esperabas este correo, puedes ignorarlo.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default Email;
