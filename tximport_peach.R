## create txdb for tximport
load.tx2gene <- function(gtffile) {
    library(GenomicFeatures)
    txdb = makeTxDbFromGFF(gtffile)
    tx2gene = select(txdb, columns= c("TXNAME", "GENEID"), keys=keys(txdb, "TXNAME"), keytype=c("TXNAME"))
    return(tx2gene)
}

## Import as gene level counts using tximport.
library(tximport)
library(readr)

tx2gene = load.tx2gene('/cbcb/project2-scratch/zliu/peach/annotation/Prunus_persica_v2.0.a1.gene.gff3')
files <-Sys.glob('/cbcb/project2-scratch/zliu/peach_chris/salmon_out/**/quant.sf')
txi <- tximport(files, type = "salmon", tx2gene = tx2gene, reader = read_tsv)
tpm<-as.data.frame(txi$abundance)

source("/cbcb/project2-scratch/zliu/scripts/Prepare_Counts.R")
tpm_counts = load.salmon("/cbcb/project2-scratch/zliu/peach_chris/salmon_out/**/quant.sf")
tpm_counts$Name<-NULL


colnames(tpm)<-colnames(tpm_counts)




tpm$V2<-rownames(tpm)
key<-read.table('/cbcb/project2-scratch/zliu/peach/annotation/key.txt',sep',',header=TRUE)


final<-merge(key,tpm,by="V2",all.x=TRUE)
final<-final[,2:37]

source("/cbcb/project2-scratch/zliu/scripts/Prepare_Counts.R")
tpm_counts = load.salmon("/cbcb/project2-scratch/zliu/peach_chris/salmon_out/**/quant.sf")
tpm_counts$Name<-NULL

