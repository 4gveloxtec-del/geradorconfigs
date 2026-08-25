import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatAllConfigs,
  generateConfigs,
  type GeneratedConfig,
} from "@/lib/config-generator";
import { usePwa } from "@/hooks/use-pwa";

export const Route = createFileRoute("/admin/gerador-configs")({
  head: () => ({
    meta: [
      { title: "Gerador de Configs — Painel Admin" },
      {
        name: "description",
        content:
          "Gere variações do arquivo-base de configuração alterando somente o segundo MAC, com cópia individual de cada config.",
      },
      { property: "og:title", content: "Gerador de Configs — Painel Admin" },
      {
        property: "og:description",
        content:
          "Gere variações do arquivo-base de configuração alterando somente o segundo MAC.",
      },
    ],
  }),
  component: GeradorConfigsPage,
});

const MIN_QTY = 1;
const MAX_QTY = 20;

function GeradorConfigsPage() {
  const { canInstall, updateReady, install, applyUpdate } = usePwa();
  const [quantity, setQuantity] = useState(5);
  const [configs, setConfigs] = useState<GeneratedConfig[]>([]);
  const [active, setActive] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const sessionMacs = useRef<Set<string>>(new Set());
  const trackRef = useRef<HTMLDivElement | null>(null);

  const clampQty = (value: number) =>
    Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(value) || MIN_QTY));

  const generate = useCallback(() => {
    const batch = generateConfigs(quantity, sessionMacs.current);
    batch.forEach((c) => sessionMacs.current.add(c.mac));
    setConfigs(batch);
    setActive(0);
    setCopiedIndex(null);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    toast.success(
      `${batch.length} ${batch.length === 1 ? "config gerada" : "configs geradas"}.`,
    );
  }, [quantity]);

  const copyText = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fallback below */
    }
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }, []);

  const copyConfig = async (index: number) => {
    const cfg = configs[index];
    if (!cfg) return;
    const ok = await copyText(cfg.xml);
    if (!ok) {
      toast.error("Não foi possível copiar. Selecione o texto manualmente.");
      return;
    }
    setCopiedIndex(index);
    toast.success("Config copiada com sucesso.");
    window.setTimeout(
      () => setCopiedIndex((cur) => (cur === index ? null : cur)),
      1800,
    );
  };

  const copyAll = async () => {
    if (configs.length === 0) return;
    const ok = await copyText(formatAllConfigs(configs));
    toast[ok ? "success" : "error"](
      ok ? "Todas as configs copiadas." : "Não foi possível copiar.",
    );
  };

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActive(index);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const children = Array.from(track.children) as HTMLElement[];
        let nearest = 0;
        let best = Infinity;
        children.forEach((child, i) => {
          const distance = Math.abs(child.offsetLeft - track.scrollLeft);
          if (distance < best) {
            best = distance;
            nearest = i;
          }
        });
        setActive(nearest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [configs.length]);

  const total = configs.length;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Gerador de Configs
        </h1>
        <p className="text-sm text-muted-foreground">
          Gere variações do arquivo-base alterando somente o segundo MAC.
        </p>
        {canInstall ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full sm:w-auto"
            onClick={() => void install()}
          >
            <Download className="mr-2 size-4" />
            Instalar aplicativo
          </Button>
        ) : null}
      </header>

      {updateReady ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/50 px-4 py-3">
          <span className="text-sm font-medium">Nova versão disponível.</span>
          <Button type="button" size="sm" onClick={applyUpdate}>
            Atualizar
          </Button>
        </div>
      ) : null}


      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade de configs</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Diminuir quantidade"
                onClick={() => setQuantity((q) => clampQty(q - 1))}
                disabled={quantity <= MIN_QTY}
              >
                −
              </Button>
              <Input
                id="quantidade"
                type="number"
                inputMode="numeric"
                min={MIN_QTY}
                max={MAX_QTY}
                value={quantity}
                onChange={(e) => setQuantity(clampQty(Number(e.target.value)))}
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Aumentar quantidade"
                onClick={() => setQuantity((q) => clampQty(q + 1))}
                disabled={quantity >= MAX_QTY}
              >
                +
              </Button>
              <span className="text-xs text-muted-foreground">
                mín. {MIN_QTY} · máx. {MAX_QTY}
              </span>
            </div>
          </div>

          <Button type="button" className="w-full sm:w-auto" onClick={generate}>
            Gerar configs
          </Button>
        </CardContent>
      </Card>

      {total > 0 && (
        <section className="mt-8 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {active + 1} de {total}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => scrollTo(Math.max(0, active - 1))}
                disabled={active === 0}
              >
                <ChevronLeft className="mr-1 size-4" />
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => scrollTo(Math.min(total - 1, active + 1))}
                disabled={active >= total - 1}
              >
                Próxima
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "thin" }}
          >
            {configs.map((cfg, index) => (
              <Card
                key={cfg.mac}
                className="w-[85vw] max-w-md shrink-0 snap-start sm:w-[420px]"
              >
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-base font-semibold">
                      Config {String(index + 1).padStart(2, "0")}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {index + 1} de {total}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      MAC gerado:
                    </p>
                    <p className="font-mono text-sm font-medium">{cfg.mac}</p>
                  </div>

                  <pre className="max-h-72 overflow-auto rounded-md border bg-muted p-3 font-mono text-xs leading-relaxed whitespace-pre select-text">
                    {cfg.xml}
                  </pre>

                  <Button
                    type="button"
                    variant={copiedIndex === index ? "secondary" : "default"}
                    className="w-full"
                    onClick={() => copyConfig(index)}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="mr-2 size-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 size-4" />
                        Copiar config
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Arraste para o lado para ver as demais configs.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={generate}>
              <RefreshCw className="mr-2 size-4" />
              Gerar novamente
            </Button>
            <Button type="button" variant="outline" onClick={copyAll}>
              <Copy className="mr-2 size-4" />
              Copiar todas
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
