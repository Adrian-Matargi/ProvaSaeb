from django.db import models
from django.contrib.auth.models import User

class Produto(models.Model):
    nome = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50, choices=[
        ('smartphone', 'Smartphone'),
        ('notebook', 'Notebook'),
        ('smart_tv', 'Smart TV'),
        ('outro', 'Outro'),
    ])

    descricao = models.TextField(blank=True)

    # características específicas
    tensao = models.CharField(max_length=20, blank=True)
    dimensoes = models.CharField(max_length=100, blank=True)
    resolucao_tela = models.CharField(max_length=50, blank=True)
    capacidade_armazenamento = models.CharField(max_length=50, blank=True)
    conectividade = models.CharField(max_length=100, blank=True)

    # Estoque
    quantidade_atual = models.IntegerField(default=0)
    estoque_minimo = models.IntegerField(default=1)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nome} ({self.quantidade_atual})"

    @property
    def estoque_baixo(self):
        """Usado para o React exibir alertas automaticamente"""
        return self.quantidade_atual <= self.estoque_minimo


class Movimentacao(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    ]

    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='movimentacoes')
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    quantidade = models.IntegerField()
    
    responsavel = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    data_movimentacao = models.DateTimeField(auto_now_add=True)

    observacao = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.tipo} - {self.produto.nome} ({self.quantidade})"
