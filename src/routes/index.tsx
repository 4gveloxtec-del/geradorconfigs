import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCode2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel Admin — Módulos" },
      {
        name: "description",
        content:
          "Painel administrativo com o módulo Gerador de Configs para criar variações do arquivo-base.",
      },
      { property: "og:title", content: "Painel Admin — Módulos" },
      {
        property: "og:description",
        content: "Acesse o módulo Gerador de Configs do painel administrativo.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Painel Admin
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Selecione um módulo para começar.
      </p>

      <Card className="mt-6 max-w-md">
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-center gap-2">
            <FileCode2 className="size-5 text-muted-foreground" />
            <h2 className="text-base font-semibold">Gerador de Configs</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Gere variações do arquivo-base alterando somente o segundo MAC.
          </p>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/admin/gerador-configs">Abrir módulo</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
